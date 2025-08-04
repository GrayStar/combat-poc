import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { STAT_TYPE_ID } from '@/lib/character/character-models';
import { CHARACTER_TYPE_ID, characterData } from '@/lib/character/character-data';
import {
	AURA_DIRECTION_TYPE_ID,
	AURA_TYPE_ID,
	AuraEffectConfig,
	SPELL_EFFECT_TYPE_ID,
	SpellEffect,
	SpellPayload,
} from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spell/spell-data';
import { Spell, SpellState } from '@/lib/spell/spell-class';
import { Aura, AuraConfig, AuraState } from '@/lib/spell/aura-class';
import {
	aruaTypeIdToSpellEffectTypeId,
	spellEffectIsApplyAura,
	spellEffectIsSchoolDamage,
} from '@/lib/spell/spell-utils';

export type CharacterState = {
	characterId: string;
	characterTypeId: CHARACTER_TYPE_ID;
	title: string;
	spells: SpellState[];
	isCastingSpell: SpellState | undefined;
	health: number;
	maxHealth: number;
	mana: number;
	maxMana: number;
	auras: AuraState[];
};

export class Character {
	public readonly characterId: string;
	public readonly characterTypeId: CHARACTER_TYPE_ID;
	public readonly title: string;

	private _health: number;
	private _maxHealth: number;
	private _mana: number;
	private _maxMana: number;
	private _spells: Spell[];
	private _currentCast?: {
		spell: SpellState;
		abortController: AbortController;
		timeout?: NodeJS.Timeout;
	};
	private _stats: Record<STAT_TYPE_ID, number>;
	private _auras: Record<string, Aura>;

	private _notify: () => void;

	constructor(characterTypeId: CHARACTER_TYPE_ID, notify: () => void) {
		const config = cloneDeep(characterData[characterTypeId]);

		this.characterId = uuidv4();
		this.characterTypeId = characterTypeId;
		this.title = config.title;

		this._health = config.maxHealth;
		this._maxHealth = config.maxHealth;
		this._mana = config.maxMana;
		this._maxMana = config.maxMana;
		this._spells = config.spellTypeIds.map((spellTypeId) => new Spell(spellTypeId, notify));
		this._stats = config.stats;
		this._auras = {};

		this._notify = notify;
	}

	// --- Health ---
	public get health() {
		return this._health;
	}

	public get maxHealth() {
		return this._maxHealth;
	}

	public setHealth(amount: number) {
		this._health = amount;
	}

	public setMaxHealth(amount: number) {
		this._maxHealth = amount;
	}

	public adjustHealth(amount: number) {
		const next = this._health + amount;
		this._health = next <= 0 ? 0 : Math.min(this._maxHealth, next);
	}

	// --- Mana ---
	public get mana() {
		return this._mana;
	}

	public get maxMana() {
		return this._maxMana;
	}

	public setMana(amount: number) {
		this._mana = amount;
	}

	public setMaxMana(amount: number) {
		this._maxMana = amount;
	}

	public adjustMana(amount: number) {
		const nextManaValue = this._mana + amount;

		if (nextManaValue < 0) {
			this._mana = 0;
			return;
		}

		if (nextManaValue > this._maxMana) {
			this._mana = this._maxMana;
			return;
		}

		this._mana = nextManaValue;
	}

	// --- Spells ---
	public get spells() {
		return this._spells;
	}

	public setSpells(spellTypeIds: SPELL_TYPE_ID[]) {
		// [TODO]:
		// If this is called, that means all the current spells will get deleted
		// so we have to clean them up, stop their timers, etc
		this._spells = spellTypeIds.map((spellTypeId) => new Spell(spellTypeId, this._notify.bind(this)));
	}

	public addSpell(spellTypeId: SPELL_TYPE_ID) {
		this._spells.push(new Spell(spellTypeId, this._notify.bind(this)));
	}

	// [TODO]:
	// add public removeSpell()
	// not sure if they should be removed by spellId, or spellTypeId

	// --- Spell casting ---
	public castSpell(spellId: string): Promise<SpellPayload> {
		if (this._currentCast) {
			return Promise.reject(new Error(`${this.title} is already casting ${this._currentCast.spell.title}.`));
		}

		const spell = this._spells.find((s) => s.spellId === spellId);
		const otherSpells = this._spells.filter((s) => s.spellId !== spellId);
		if (!spell) {
			return Promise.reject(new Error('spell is undefined.'));
		}

		const spellPayload = this.createSpellPayloadForCastSpell(spell);

		if (spell.castTimeDurationInMs <= 0) {
			spell.startCooldown();
			otherSpells.forEach((s) => {
				s.startGlobalCooldown();
			});

			this._notify();
			return Promise.resolve(spellPayload);
		}

		return new Promise((resolve: (value: SpellPayload) => void, reject) => {
			const abortController = new AbortController();
			const { signal } = abortController;
			this._currentCast = { spell: spell.getState(), abortController };

			this._notify();

			const timeout = setTimeout(() => {
				this._clearCurrentCast();

				spell.startCooldown();
				otherSpells.forEach((s) => {
					s.startGlobalCooldown();
				});

				this._notify();
				return resolve(spellPayload);
			}, spell.castTimeDurationInMs);

			this._currentCast.timeout = timeout;

			signal.addEventListener(
				'abort',
				() => {
					this._clearCurrentCast();
					this._notify();

					return reject(new Error(`${this.title} was interrupted.`));
				},
				{ once: true }
			);
		});
	}

	private _clearCurrentCast(): void {
		if (!this._currentCast) {
			return;
		}

		clearTimeout(this._currentCast.timeout);
		this._currentCast = undefined;
	}

	public interuptCasting(): void {
		if (!this._currentCast) {
			return;
		}

		this._currentCast.abortController.abort();
	}

	private createSpellPayloadForCastSpell(spell: Spell): SpellPayload {
		const auraEffectConfigs = Object.values(this._auras)
			.flatMap((aura) => aura.auraEffectConfigs || [])
			.filter((cfg) => cfg.auraDirectionTypeId === AURA_DIRECTION_TYPE_ID.OUTGOING);
		const effectedSpellTypeIds = new Map<SPELL_EFFECT_TYPE_ID, AuraEffectConfig[]>();
		const effectedAuraTypeIds = new Map<AURA_TYPE_ID, AuraEffectConfig[]>();

		for (const cfg of auraEffectConfigs) {
			const mapping = aruaTypeIdToSpellEffectTypeId[cfg.auraTypeId];
			// map to spellEffectTypeIds
			for (const spellId of mapping.effectedSpellEffectTypeIds ?? []) {
				if (!effectedSpellTypeIds.has(spellId)) {
					effectedSpellTypeIds.set(spellId, []);
				}
				effectedSpellTypeIds.get(spellId)!.push(cfg);
			}
			// map to auraTypeIds
			for (const auraId of mapping.effectedAuraTypeIds ?? []) {
				if (!effectedAuraTypeIds.has(auraId)) {
					effectedAuraTypeIds.set(auraId, []);
				}
				effectedAuraTypeIds.get(auraId)!.push(cfg);
			}
		}

		const statProcessedSpellEffects = spell.spellEffects.map((spellEffect) => {
			const valueWithCharacterStatsApplied = spellEffect.valueModifiers.reduce(
				(sum, { stat, coefficient }) => sum + this._stats[stat] * coefficient,
				spellEffect.value
			);

			let valueWithAurasApplied = valueWithCharacterStatsApplied;

			if (auraEffectConfigs.length > 0) {
				// O(1) lookups from our indexes
				const bySpell = effectedSpellTypeIds.get(spellEffect.spellEffectTypeId) || [];
				const byAura = spellEffectIsApplyAura(spellEffect)
					? effectedAuraTypeIds.get(spellEffect.auraTypeId) || []
					: [];

				// c) apply each matching config
				valueWithAurasApplied = [...bySpell, ...byAura].reduce(
					(currentValue, cfg) =>
						aruaTypeIdToSpellEffectTypeId[cfg.auraTypeId].applyToValue?.(currentValue, cfg.value) ?? 0,
					valueWithAurasApplied
				);
			}

			// d) return the updated effect
			return {
				...spellEffect,
				value: valueWithAurasApplied,
			};
		});

		return {
			casterId: this.characterId,
			title: spell.title,
			spellTypeId: spell.spellTypeId,
			schoolTypeId: spell.schoolTypeId,
			auraDurationInMs: spell.auraDurationInMs,
			spellEffects: statProcessedSpellEffects,
		};
	}

	public recieveSpellPayload(spellPayload: SpellPayload, callback: (message: string) => void) {
		// Do not process incoming auras through buffs/debuffs
		const auraEffectConfigs = spellPayload.spellEffects
			.filter((spellEffect) => spellEffect.spellEffectTypeId === SPELL_EFFECT_TYPE_ID.APPLY_AURA)
			.map(({ auraTypeId, auraDirectionTypeId, value, intervalInMs }) => ({
				auraTypeId,
				schoolTypeId: spellPayload.schoolTypeId,
				auraDirectionTypeId,
				value,
				intervalInMs,
			}));

		// [TODO]: Process applicable immediate effects through buffs/debuffs
		const otherEffects = spellPayload.spellEffects.filter(
			(spellEffect) => spellEffect.spellEffectTypeId !== SPELL_EFFECT_TYPE_ID.APPLY_AURA
		);

		const otherEffectMap: Record<SPELL_EFFECT_TYPE_ID, (spellEffect: SpellEffect) => void> = {
			[SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE]: (spellEffect) => {
				this.adjustHealth(-spellEffect.value);
				if (spellEffectIsSchoolDamage(spellEffect)) {
					callback(`${this.title} took ${spellEffect.value} ${spellEffect.schoolTypeId} damage.`);
				}
			},
			[SPELL_EFFECT_TYPE_ID.DISPEL]: (spellEffect) => {
				console.log('[TODO]: handle dispel', spellEffect);
			},
			[SPELL_EFFECT_TYPE_ID.HEAL]: (spellEffect) => {
				this.adjustHealth(spellEffect.value);
				callback(`${this.title} was healed for ${spellEffect.value}.`);
			},
			[SPELL_EFFECT_TYPE_ID.APPLY_AURA]: (spellEffect) => {
				console.log('[TODO]: throw error, as auras should not be in this array.', spellEffect);
			},
		};

		otherEffects.forEach((otherEffect) => {
			otherEffectMap[otherEffect.spellEffectTypeId](otherEffect);
		});

		if (auraEffectConfigs.length > 0) {
			this.applyAura({
				title: spellPayload.title,
				spellTypeId: spellPayload.spellTypeId,
				durationInMs: spellPayload.auraDurationInMs,
				auraEffectConfigs,
			});
		}
	}

	// --- Auras ---
	public applyAura(auraConfig: AuraConfig) {
		const existingAura = Object.values(this._auras).find((a) => a.spellTypeId === auraConfig.spellTypeId);

		if (existingAura) {
			existingAura.restartTimers();
		} else {
			const aura = new Aura(auraConfig, this.handleAuraInterval.bind(this), this.handleAuraTimeout.bind(this));
			this._auras[aura.auraId] = aura;
		}

		this._notify();
	}

	private handleAuraInterval(_auraId: string, auraEffectConfigs: AuraEffectConfig[]) {
		const auraTypeIdMap: Record<AURA_TYPE_ID, (auraEffectConfig: AuraEffectConfig) => void> = {
			[AURA_TYPE_ID.MODIFY_DAMAGE_FLAT]: () => {
				return;
			},
			[AURA_TYPE_ID.MODIFY_DAMAGE_MULTIPLIER]: () => {
				return;
			},
			[AURA_TYPE_ID.MOFIFY_DAMAGE_PERCENT]: () => {
				return;
			},
			[AURA_TYPE_ID.PERIODIC_DAMAGE]: (auraEffectConfig) => {
				this.adjustHealth(-auraEffectConfig.value);
			},
		};

		auraEffectConfigs.forEach((auraEffectConfig) => {
			auraTypeIdMap[auraEffectConfig.auraTypeId](auraEffectConfig);
		});

		this._notify();
	}

	private handleAuraTimeout(auraId: string) {
		const aura = this._auras[auraId];

		if (!aura) {
			return;
		}

		aura.stopTimers();
		delete this._auras[auraId];

		this._notify();
	}

	// --- State Snapshot ---
	public getState(): CharacterState {
		return {
			characterId: this.characterId,
			characterTypeId: this.characterTypeId,
			title: this.title,
			spells: this._spells.map((spell) => spell.getState()),
			isCastingSpell: this._currentCast?.spell,
			health: this._health,
			maxHealth: this._maxHealth,
			mana: this._mana,
			maxMana: this._maxMana,
			auras: Object.values(this._auras).map((aura) => aura.getState()),
		};
	}
}
