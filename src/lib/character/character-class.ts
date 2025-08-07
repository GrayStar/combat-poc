import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { STAT_TYPE_ID } from '@/lib/character/character-models';
import { CHARACTER_TYPE_ID, characterData } from '@/lib/character/character-data';
import { RESOURCE_TYPE_ID, SpellPayload } from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spell/spell-data';
import { Spell, SpellState } from '@/lib/spell/spell-class';
import { Aura, AuraConfig, AuraState } from '@/lib/spell/aura-class';
import { SpellEffectSchoolDamage } from '../spell/spell-effects/spell-effect-school-damage';
import { SpellEffectDispel } from '@/lib/spell/spell-effects/spell-effect-dispel';
import { SpellEffectHeal } from '@/lib/spell/spell-effects/spell-effect-heal';

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
	renderKeyDamage: string;
	renderKeyHealing: string;
	renderKeyCastSpell: string;
	stats: Record<STAT_TYPE_ID, number>;
};

export class Character {
	public readonly characterId: string;
	public readonly characterTypeId: CHARACTER_TYPE_ID;
	public readonly title: string;

	private _maxHealth: number;
	private _health: number;
	private _maxMana: number;
	private _mana: number;
	private _spells: Spell[];
	private _currentCast?: {
		spell: SpellState;
		abortController: AbortController;
		timeout?: NodeJS.Timeout;
	};
	private _stats: Record<STAT_TYPE_ID, number>;
	private _auras: Record<string, Aura>;

	private _renderKeyDamage: string = '';
	private _renderKeyHealing: string = '';
	private _renderKeyCastSpell: string = '';
	private _notify: () => void;

	constructor(characterTypeId: CHARACTER_TYPE_ID, notify: () => void) {
		const config = cloneDeep(characterData[characterTypeId]);

		this.characterId = uuidv4();
		this.characterTypeId = characterTypeId;
		this.title = config.title;

		this._maxHealth = config.stats[STAT_TYPE_ID.VITALITY] * 10;
		this._health = this.maxHealth;
		this._maxMana = config.stats[STAT_TYPE_ID.WISDOM] * 15;
		this._mana = this._maxMana;
		this._spells = config.spellTypeIds.map((spellTypeId) => new Spell(spellTypeId, this, notify));
		this._stats = config.stats;
		this._auras = {};

		this._notify = notify;
	}

	/* ----------------------------------------------- */
	/* Health */
	/* ----------------------------------------------- */
	public get health() {
		return this._health;
	}

	public get maxHealth() {
		return this._maxHealth;
	}

	public adjustHealth(amount: number) {
		const next = this._health + amount;
		this._health = next <= 0 ? 0 : Math.min(this._maxHealth, next);

		if (amount < 0) {
			this._renderKeyDamage = uuidv4();
		} else if (amount > 0) {
			this._renderKeyHealing = uuidv4();
		}
		this._notify();
	}

	/* ----------------------------------------------- */
	/* Mana */
	/* ----------------------------------------------- */
	public get mana() {
		return this._mana;
	}

	public get maxMana() {
		return this._maxMana;
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
		this._notify();
	}

	/* ----------------------------------------------- */
	/* Stats */
	/* ----------------------------------------------- */
	public get stats() {
		return this._stats;
	}

	public setStat(statTypeId: STAT_TYPE_ID, value: number) {
		this._stats[statTypeId] = value;
		this._updateResourceMaxValues();
		this._notify();
	}

	private _updateResourceMaxValues() {
		// logic to add health if it goes up, remove it if it goes down
		this._maxHealth = this._stats[STAT_TYPE_ID.VITALITY] * 10;
		this._maxMana = this._stats[STAT_TYPE_ID.WISDOM] * 15;
	}

	/* ----------------------------------------------- */
	/* Spells */
	/* ----------------------------------------------- */
	public get spells() {
		return this._spells;
	}

	public setSpells(spellTypeIds: SPELL_TYPE_ID[]) {
		if (this.spells.length > 0) {
			this.spells.forEach((spell) => {
				spell.stopCooldown();
			});
		}

		this._spells = spellTypeIds.map((spellTypeId) => new Spell(spellTypeId, this, this._notify.bind(this)));
		this._notify();
	}

	public addSpell(spellTypeId: SPELL_TYPE_ID) {
		this._spells.push(new Spell(spellTypeId, this, this._notify.bind(this)));
		this._notify();
	}

	// [TODO]: public removeSpell()
	// not sure if they should be removed by spellId, or spellTypeId

	/* ----------------------------------------------- */
	/* Spell Casting */
	/* ----------------------------------------------- */
	public castSpell(spellId: string): Promise<SpellPayload> {
		if (this._currentCast) {
			return Promise.reject(new Error(`${this.title} is already casting ${this._currentCast.spell.title}.`));
		}

		const spell = this._spells.find((s) => s.spellId === spellId);
		const otherSpells = this._spells.filter((s) => s.spellId !== spellId);
		if (!spell) {
			return Promise.reject(new Error('spell is undefined.'));
		}

		const spellPayload = spell.getPayload();

		if (spell.castTimeDurationInMs <= 0) {
			this._handleSpellPayloadCost(spellPayload);

			spell.startCooldown();
			otherSpells.forEach((s) => {
				s.startGlobalCooldown();
			});

			this._renderKeyCastSpell = uuidv4();
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
				this._handleSpellPayloadCost(spellPayload);

				spell.startCooldown();
				otherSpells.forEach((s) => {
					s.startGlobalCooldown();
				});

				this._renderKeyCastSpell = uuidv4();
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

	private _handleSpellPayloadCost(spellPayload: SpellPayload): void {
		spellPayload.cost.forEach((c) => {
			// TODO: Check costs and throw ERROR------------------------------

			if (c.resourceTypeId === RESOURCE_TYPE_ID.HEALTH) {
				this.adjustHealth(-c.amountFlat);
				return;
			}
			if (c.resourceTypeId === RESOURCE_TYPE_ID.MANA) {
				this.adjustMana(-c.amountFlat);
				return;
			}
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

	public recieveSpellPayload(spellPayload: SpellPayload, _callback: (message: string) => void) {
		spellPayload.damageEffects.forEach((se) => {
			new SpellEffectSchoolDamage(se, this);
		});

		spellPayload.healEffects.forEach((se) => {
			new SpellEffectHeal(se, this);
		});

		spellPayload.dispelEffects.forEach((se) => {
			new SpellEffectDispel(se, this);
		});

		spellPayload.auras.forEach((a) => {
			this.applyAura({
				title: spellPayload.title,
				spellTypeId: spellPayload.spellTypeId,
				durationInMs: a.durationInMs,
				dispelTypeId: a.dispelTypeId,
				periodicEffects: a.periodicEffects,
				modifyStatEffects: a.modifyStatEffects,
			});
		});
	}

	/* ----------------------------------------------- */
	/* Auras */
	/* ----------------------------------------------- */
	public applyAura(auraConfig: AuraConfig) {
		const existingAura = Object.values(this._auras).find((a) => a.spellTypeId === auraConfig.spellTypeId);

		if (existingAura) {
			existingAura.restartTimers();
		} else {
			const aura = new Aura(auraConfig, this);
			this._auras[aura.auraId] = aura;
		}

		this._notify();
	}

	public removeAuraByAuraId(auraId: string) {
		const aura = this._auras[auraId];

		if (!aura) {
			return;
		}

		aura.stopTimers();
		delete this._auras[auraId];

		this._notify();
	}

	public getAuraStateByAuraId(auraId: string) {
		return this._auras[auraId].getState();
	}

	public getAuraStates() {
		return Object.entries(this._auras).reduce<Record<string, AuraState>>(
			(acc, [key, value]) => ({
				...acc,
				[key]: value.getState(),
			}),
			{}
		);
	}

	/* ----------------------------------------------- */
	/* State */
	/* ----------------------------------------------- */
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
			renderKeyDamage: this._renderKeyDamage,
			renderKeyHealing: this._renderKeyHealing,
			renderKeyCastSpell: this._renderKeyCastSpell,
			stats: this._stats,
		};
	}
}
