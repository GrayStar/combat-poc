import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { SPELL_TYPE_ID, spellData } from './spell-data';
import { DISPEL_TYPE_ID, SCHOOL_TYPE_ID, SpellEffect } from './spell-models';

export type SpellState = {
	spellId: string;
	spellTypeId: SPELL_TYPE_ID;
	title: string;
	description: string;
	castTimeDurationInMs: number;
	cooldownDurationInMs: number;
	isOnCooldown: boolean;
};

export class Spell {
	public readonly spellId: string;
	public readonly spellTypeId: SPELL_TYPE_ID;
	public readonly title: string;
	public readonly description: string;
	public readonly castTimeDurationInMs: number;
	public readonly cooldownDurationInMs: number;
	public readonly globalCooldownDurationInMs: number;
	public readonly auraDurationInMs: number;
	public readonly schoolTypeId: SCHOOL_TYPE_ID;
	public readonly dispelTypeId: DISPEL_TYPE_ID;
	public readonly spellEffects: SpellEffect[];

	private _cooldownAnimationDurationInMs: number;
	private _cooldownTimeout?: NodeJS.Timeout;
	private _notify: () => void;

	constructor(spellTypeId: SPELL_TYPE_ID, notify: () => void) {
		const config = cloneDeep(spellData[spellTypeId]);

		this.spellId = uuidv4();
		this.spellTypeId = spellTypeId;
		this.title = config.title;
		this.description = config.description;
		this.castTimeDurationInMs = config.castTimeDurationInMs;
		this.cooldownDurationInMs =
			config.cooldownDurationInMs > config.globalCooldownDurationInMs
				? config.cooldownDurationInMs
				: config.globalCooldownDurationInMs;
		this.globalCooldownDurationInMs = config.globalCooldownDurationInMs;
		this.auraDurationInMs = config.auraDurationInMs;
		this.schoolTypeId = config.schoolTypeId;
		this.dispelTypeId = config.dispelTypeId;
		this.spellEffects = config.spellEffects;

		this._cooldownAnimationDurationInMs = this.cooldownDurationInMs;

		this._notify = notify;
	}

	public stopCooldown(): void {
		if (!this._cooldownTimeout) {
			return;
		}

		clearTimeout(this._cooldownTimeout);
		this._cooldownTimeout = undefined;

		this._notify();
	}

	public startCooldown(): void {
		if (this._cooldownTimeout) {
			return;
		}

		this._cooldownAnimationDurationInMs = this.cooldownDurationInMs;

		this._cooldownTimeout = setTimeout(() => {
			this._cooldownTimeout = undefined;
			this._notify();
		}, this.cooldownDurationInMs);

		this._notify();
	}

	public startGlobalCooldown(): void {
		if (this._cooldownTimeout) {
			return;
		}

		this._cooldownAnimationDurationInMs = this.globalCooldownDurationInMs;

		this._cooldownTimeout = setTimeout(() => {
			this._cooldownTimeout = undefined;
			this._notify();
		}, this.globalCooldownDurationInMs);

		this._notify();
	}

	public getState(): SpellState {
		return {
			spellId: this.spellId,
			spellTypeId: this.spellTypeId,
			title: this.title,
			description: this.description,
			castTimeDurationInMs: this.castTimeDurationInMs,
			cooldownDurationInMs: this._cooldownAnimationDurationInMs,
			isOnCooldown: !!this._cooldownTimeout,
		};
	}
}
