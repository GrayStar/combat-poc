import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { CHARACTER_TYPE_ID, characterData } from '@/lib/character';
import { SPELL_TYPE_ID } from '../status-effect';

export type CharacterState = {
	characterId: string;
	characterTypeId: CHARACTER_TYPE_ID;
	title: string;
	spellIds: string[];
	statusEffectIds: string[];
	isCasting: boolean;
	castTimeDurationInMs: number | undefined;
	health: number;
	maxHealth: number;
	mana: number;
	maxMana: number;
};

export class Character {
	public readonly characterId: string;
	public readonly characterTypeId: CHARACTER_TYPE_ID;
	public readonly title: string;
	public readonly spellTypeIds: SPELL_TYPE_ID[];

	private _spellIds: string[];
	private _statusEffectIds: string[];
	private _isCasting: boolean;
	private _health: number;
	private _maxHealth: number;
	private _mana: number;
	private _maxMana: number;
	private _castingTimeout?: NodeJS.Timeout;
	private _castTimeDurationInMs?: number;

	constructor(characterTypeId: CHARACTER_TYPE_ID) {
		const config = cloneDeep(characterData[characterTypeId]);

		this.characterId = uuidv4();
		this.characterTypeId = characterTypeId;
		this.title = config.title;
		this.spellTypeIds = config.spellTypeIds;

		this._spellIds = [];
		this._statusEffectIds = [];
		this._isCasting = false;
		this._health = config.maxHealth;
		this._maxHealth = config.maxHealth;
		this._mana = config.maxMana;
		this._maxMana = config.maxMana;
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
		const next = this._mana + amount;
		this._mana = next <= 0 ? 0 : Math.min(this._maxMana, next);
	}

	// --- Spell Casting ---
	public get spellIds() {
		return [...this._spellIds];
	}

	public get isCasting() {
		return this._isCasting;
	}

	public get castTimeDurationInMs(): number | undefined {
		return this._castTimeDurationInMs;
	}

	public setSpellIds(spellIds: string[]) {
		this._spellIds = [...spellIds];
	}

	public setIsCasting(isCasting: boolean) {
		this._isCasting = isCasting;
	}

	// --- Status Effects ---
	public get statusEffectIds(): string[] {
		return [...this._statusEffectIds];
	}

	public addStatusEffectId(id: string): void {
		if (!this._statusEffectIds.includes(id)) {
			this._statusEffectIds.push(id);
		}
	}

	public removeStatusEffectId(id: string): void {
		this._statusEffectIds = this._statusEffectIds.filter((existing) => existing !== id);
	}

	public startCastingSpellBySpellId(spellId: string, duration: number, onComplete: (spellId: string) => void): void {
		if (this._castingTimeout) {
			clearTimeout(this._castingTimeout);
		}

		this._isCasting = true;
		this._castTimeDurationInMs = duration;

		this._castingTimeout = setTimeout(() => {
			this._isCasting = false;
			this._castingTimeout = undefined;
			this._castTimeDurationInMs = undefined;

			onComplete(spellId);
		}, duration);
	}

	public interuptCasting(): void {
		if (this._castingTimeout) {
			clearTimeout(this._castingTimeout);
			this._castingTimeout = undefined;
		}

		this._isCasting = false;
		this._castTimeDurationInMs = undefined;
	}

	// --- State Snapshot ---
	public getState(): CharacterState {
		return {
			characterId: this.characterId,
			characterTypeId: this.characterTypeId,
			title: this.title,
			spellIds: this.spellIds,
			statusEffectIds: this.statusEffectIds,
			isCasting: this._isCasting,
			castTimeDurationInMs: this._castTimeDurationInMs,
			health: this._health,
			maxHealth: this._maxHealth,
			mana: this._mana,
			maxMana: this._maxMana,
		};
	}
}
