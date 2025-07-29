import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { SPELL_TYPE_ID, spellData, SpellEffect } from '@/lib/spell';

export type SpellState = {
	spellId: string;
	spellTypeId: SPELL_TYPE_ID;
	title: string;
	description: string;
	cooldownDurationInMs: number;
	castTimeDurationInMs?: number;
	casterEffects?: SpellEffect;
	targetEffects?: SpellEffect;
	isOnCooldown: boolean;
};

export class Spell {
	public readonly spellId: string;
	public readonly spellTypeId: SPELL_TYPE_ID;
	public readonly title: string;
	public readonly description: string;
	public readonly cooldownDurationInMs: number;
	public readonly castTimeDurationInMs?: number;
	public readonly casterEffects?: SpellEffect;
	public readonly targetEffects?: SpellEffect;

	private _isOnCooldown = false;
	private _cooldownTimeout?: NodeJS.Timeout;
	private _notify: () => void;

	constructor(spellTypeId: SPELL_TYPE_ID, notify: () => void) {
		const config = cloneDeep(spellData[spellTypeId]);

		this.spellId = uuidv4();
		this.spellTypeId = spellTypeId;
		this.title = config.title;
		this.description = config.description;
		this.cooldownDurationInMs = config.cooldownDurationInMs;
		this.castTimeDurationInMs = config.castTimeDurationInMs;
		this.casterEffects = config.casterEffects;
		this.targetEffects = config.targetEffects;

		this._notify = notify;
	}

	public get isOnCooldown() {
		return this._isOnCooldown;
	}

	public stopCooldown(): void {
		if (!this._cooldownTimeout) {
			return;
		}

		clearTimeout(this._cooldownTimeout);
		this._cooldownTimeout = undefined;
		this._isOnCooldown = false;

		console.log('stopCooldown');
		this._notify();
	}

	public startCooldown(): void {
		this.stopCooldown();
		this._isOnCooldown = true;

		console.log('startCooldown');
		this._notify();

		this._cooldownTimeout = setTimeout(() => {
			this._isOnCooldown = false;
			console.log('cooldownComplete');
			this._notify();
		}, this.cooldownDurationInMs);
	}

	public getState(): SpellState {
		return {
			spellId: this.spellId,
			spellTypeId: this.spellTypeId,
			title: this.title,
			description: this.description,
			cooldownDurationInMs: this.cooldownDurationInMs,
			castTimeDurationInMs: this.castTimeDurationInMs,
			casterEffects: this.casterEffects,
			targetEffects: this.targetEffects,
			isOnCooldown: this._isOnCooldown,
		};
	}
}
