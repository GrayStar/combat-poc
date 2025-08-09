import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { roundNumber } from '@/lib/utils/number-utils';
import { ALL_STAT_TYPE_ID, STAT_TYPE_ID } from '@/lib/character/character-models';
import { characterData, defaultSecondaryStats } from '@/lib/character/character-data';
import { RESOURCE_TYPE_ID, SpellPayload } from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spell/spell-data';
import { Spell, SpellState } from '@/lib/spell/spell-class';
import { Aura, AuraConfig, AuraState } from '@/lib/spell/aura-class';
import { SpellEffectSchoolDamage } from '@/lib/spell/spell-effects/spell-effect-school-damage';
import { SpellEffectDispel } from '@/lib/spell/spell-effects/spell-effect-dispel';
import { SpellEffectHeal } from '@/lib/spell/spell-effects/spell-effect-heal';
import { SpellEffectInterrupt } from '@/lib/spell/spell-effects/spell-effect-interrupt';
import { SpellEffectSummon } from '@/lib/spell/spell-effects/spell-effect-summon';
import { CHARACTER_TYPE_ID } from '../data/enums';
import { Battle } from '@/lib/battle/battle-class';
import { SpellEffectResourceFill } from '../spell/spell-effects/spell-effect-resource-fill';

export type CharacterState = {
	characterId: string;
	characterTypeId: CHARACTER_TYPE_ID;
	title: string;
	spells: SpellState[];
	potions: SpellState[];
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
	threat: Record<string, number>;
};

export abstract class Character {
	public readonly characterId: string;
	public readonly characterTypeId: CHARACTER_TYPE_ID;
	public readonly title: string;

	//move this stuff out eventually.
	protected _targetCharacterId?: string = '';
	protected _summonedBySpellId?: string = '';

	private _maxHealth: number = 0;
	private _maxMana: number = 0;
	private _health: number;
	private _mana: number;
	private _spells: Spell[];
	protected _currentCast?: {
		spell: SpellState;
		timeout: NodeJS.Timeout;
	};
	private _stats: Record<ALL_STAT_TYPE_ID, number>;
	private _auras: Record<string, Aura>;

	private _renderKeyDamage: string = '';
	private _renderKeyHealing: string = '';
	private _renderKeyCastSpell: string = '';
	protected _threat: Record<string, number> = {};

	protected _battle: Battle;

	constructor(characterTypeId: CHARACTER_TYPE_ID, battle: Battle) {
		const config = cloneDeep(characterData[characterTypeId]);

		this.characterId = uuidv4();
		this.characterTypeId = characterTypeId;
		this.title = config.title;

		this._stats = { ...config.stats, ...defaultSecondaryStats };
		this._updateResourceMaxValues();
		this._health = this.maxHealth;
		this._mana = this._maxMana;
		this._spells = config.spellTypeIds.map((spellTypeId) => new Spell(spellTypeId, this));
		this._auras = {};

		this._battle = battle;
	}

	public get targetCharacterId() {
		return this._targetCharacterId;
	}
	public get summonedBySpellId() {
		return this._summonedBySpellId;
	}

	public get battle() {
		return this._battle;
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
		const next = roundNumber(this._health + amount);
		this._health = next <= 0 ? 0 : Math.min(this._maxHealth, next);

		if (amount < 0) {
			this._renderKeyDamage = uuidv4();
		} else if (amount > 0) {
			this._renderKeyHealing = uuidv4();
		}

		if (this._health <= 0) {
			this.die();
		}

		this._battle.notify();
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
		const nextManaValue = roundNumber(this._mana + amount);

		if (nextManaValue < 0) {
			this._mana = 0;
			return;
		}

		if (nextManaValue > this._maxMana) {
			this._mana = this._maxMana;
			return;
		}

		this._mana = nextManaValue;
		this._battle.notify();
	}

	/* ----------------------------------------------- */
	/* Stats */
	/* ----------------------------------------------- */
	public get stats() {
		return this._stats;
	}

	public setStat(statTypeId: ALL_STAT_TYPE_ID, value: number) {
		this._stats[statTypeId] = value;
		this._updateResourceMaxValues();
		this._battle.notify();
	}

	private _updateResourceMaxValues() {
		// logic to add health if it goes up, remove it if it goes down
		this._maxHealth = this._stats[STAT_TYPE_ID.VITALITY] * 10;
		// logic to add mana if it goes up, remove it if it goes down
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

		this._spells = spellTypeIds.map((spellTypeId) => new Spell(spellTypeId, this));
		this._battle.notify();
	}

	public addSpell(spellTypeId: SPELL_TYPE_ID) {
		this._spells.push(new Spell(spellTypeId, this));
		this._battle.notify();
	}

	// [TODO]: public removeSpell()
	// not sure if they should be removed by spellId, or spellTypeId

	/* ----------------------------------------------- */
	/* Spell Casting */
	/* ----------------------------------------------- */
	public castSpell(spellId: string, targetId: string) {
		if (this._currentCast) {
			this.battle.addCombatLogMessage('Already casting.');
			return;
		}

		const target = this._battle.characters[targetId];
		if (!target) {
			this.battle.addCombatLogMessage('Invalid target.');
			return;
		}

		const spell = this._spells.find((s) => s.spellId === spellId);
		const otherSpells = this._spells.filter((s) => s.spellId !== spellId);
		if (!spell) {
			this.battle.addCombatLogMessage('Invalid spell.');
			return;
		}

		if (spell.hasCharges && spell.charges <= 0) {
			this.battle.addCombatLogMessage('Spell is out of charges.');
			return;
		}

		const spellPayload = spell.getPayload();

		if (!this._canAffordSpellPayload(spellPayload)) {
			this.battle.addCombatLogMessage('Cannot afford spell.');
			return;
		}

		const sendSpellPayloadToTarget = () => {
			this._clearCurrentCast();
			this._handleSpellPayloadCost(spellPayload);
			target.recieveSpellPayload(spellPayload);

			if (spell.hasCharges) {
				spell.removeCharge();
			}

			spell.startCooldown();
			otherSpells.forEach((s) => {
				s.startGlobalCooldown();
			});

			this._renderKeyCastSpell = uuidv4();
		};

		if (spellPayload.castTimeDurationInMs <= 0) {
			sendSpellPayloadToTarget();
			this._battle.notify();
			return;
		}

		this._currentCast = {
			spell: spell.getState(),
			timeout: setTimeout(() => {
				this._clearCurrentCast();
				sendSpellPayloadToTarget();
				this._battle.notify();
			}, spellPayload.castTimeDurationInMs),
		};

		this._battle.notify();
	}

	private _canAffordSpellPayload({ cost }: SpellPayload): boolean {
		return cost.every((c) => {
			if (c.resourceTypeId === RESOURCE_TYPE_ID.HEALTH) {
				return this._health >= c.amountFlat;
			}
			if (c.resourceTypeId === RESOURCE_TYPE_ID.MANA) {
				return this._mana >= c.amountFlat;
			}
			return true;
		});
	}

	private _handleSpellPayloadCost({ cost }: SpellPayload): void {
		cost.forEach((c) => {
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
		this._clearCurrentCast();
		this._battle.notify();
	}

	public recieveSpellPayload(spellPayload: SpellPayload) {
		spellPayload.damageEffects.forEach((se) => {
			new SpellEffectSchoolDamage(se, this, spellPayload.casterId);
		});

		spellPayload.healEffects.forEach((se) => {
			new SpellEffectHeal(se, this, spellPayload.casterId);
		});

		spellPayload.dispelEffects.forEach((se) => {
			new SpellEffectDispel(se, this, spellPayload.casterId);
		});

		spellPayload.interruptEffects.forEach((se) => {
			new SpellEffectInterrupt(se, this, spellPayload.casterId);
		});

		spellPayload.summonEffects.forEach((se) => {
			new SpellEffectSummon(se, this, spellPayload.casterId, spellPayload.spellId);
			this._battle.notify();
		});

		spellPayload.resourceFillEffects.forEach((se) => {
			new SpellEffectResourceFill(se, this, spellPayload.casterId);
		});

		spellPayload.auras.forEach((a) => {
			this.applyAura({
				casterId: spellPayload.casterId,
				title: spellPayload.title,
				spellTypeId: spellPayload.spellTypeId,
				durationInMs: a.durationInMs,
				dispelTypeId: a.dispelTypeId,
				periodicEffects: a.periodicEffects,
				modifyStatEffects: a.modifyStatEffects,
			});
		});

		this._recieveSpellSideEffects();
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

		this._battle.notify();
	}

	public removeAuraByAuraId(auraId: string) {
		const aura = this._auras[auraId];

		if (!aura) {
			return;
		}

		aura.stopTimers();
		delete this._auras[auraId];

		this._battle.notify();
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
		const spellStates = this._spells.filter((s) => !s.isPotion).map((spell) => spell.getState());
		const potionStates = this._spells.filter((s) => s.isPotion).map((spell) => spell.getState());

		return {
			characterId: this.characterId,
			characterTypeId: this.characterTypeId,
			title: this.title,
			spells: spellStates,
			potions: potionStates,
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
			threat: this._threat,
		};
	}

	/* ----------------------------------------------- */
	/* Threat */
	/* ----------------------------------------------- */
	public get threat() {
		return this._threat;
	}

	public setThreat(threat: Record<string, number>) {
		this._threat = threat;
		this._determineTarget();
	}

	public removeThreat(characterId: string) {
		delete this._threat[characterId];
		this._determineTarget();
	}

	public adjustThreat(characterId: string, amount: number) {
		const entryIsSelf = characterId === this.characterId;
		if (entryIsSelf) {
			return;
		}

		const entryIsAlive = !!this.battle.characters[characterId];
		if (!entryIsAlive) {
			return;
		}

		const currentThreat = this._threat[characterId] ?? 0;
		const nextThreat = currentThreat + amount;

		if (nextThreat <= 0) {
			delete this._threat[characterId];
			return;
		}

		this._threat[characterId] = nextThreat;
		this._determineTarget();
	}

	protected abstract _determineTarget(): void;

	/* ----------------------------------------------- */
	/* Death */
	/* ----------------------------------------------- */
	public die(): void {
		this._clearCurrentCast();
		this.spells.forEach((s) => s.stopCooldown());
		Object.values(this._auras).forEach((a) => {
			this.removeAuraByAuraId(a.auraId);
		});

		this._threat = {};
		this._mana = 0;
		this._health = 0;
		this._dieTriggerSideEffects();

		this._battle.removeCharacterByCharacterId(this.characterId);
		this._battle.notify();
		this._battle.addCombatLogMessage(`${this.title} died.`);
	}

	protected abstract _dieTriggerSideEffects(): void;
	public abstract determineNextAction(): void;
	protected abstract _recieveSpellSideEffects(): void;
}
