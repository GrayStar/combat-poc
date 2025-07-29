import { v4 as uuidv4 } from 'uuid';
import { cloneDeep, get, set } from 'lodash';
import { STATUS_EFFECT_TYPE_ID, statusEffectData, StatusEffectModifier } from '@/lib/status-effect';
import { Spell } from '@/lib/spell';

export type StatusEffectState = {
	statusEffectId: string;
	statusEffectTypeId: STATUS_EFFECT_TYPE_ID;
	title: string;
	description: string;
	stacks: number;
};

export class StatusEffect {
	public readonly statusEffectId: string;
	public readonly statusEffectTypeId: STATUS_EFFECT_TYPE_ID;
	public readonly title: string;
	public readonly description: string;
	public readonly durationInMs: number;
	public readonly intervalInMs: number;
	public readonly incomingSpellModifiers: StatusEffectModifier[];

	private _stacks = 0;
	private _interval?: NodeJS.Timeout;
	private _timeout?: NodeJS.Timeout;
	private readonly _notify: () => void;

	constructor(statusEffectTypeId: STATUS_EFFECT_TYPE_ID, notify: () => void) {
		const config = cloneDeep(statusEffectData[statusEffectTypeId]);

		this.statusEffectId = uuidv4();
		this.statusEffectTypeId = statusEffectTypeId;
		this.title = config.title;
		this.description = config.description;
		this.durationInMs = config.duration;
		this.intervalInMs = config.interval;
		this.incomingSpellModifiers = config.incomingSpellModifiers;

		this._notify = notify;

		if (this.intervalInMs > 0) {
			this.startInterval();
		}
		this.startTimeout();
	}

	public get stacks(): number {
		return this._stacks;
	}

	public set stacks(value: number) {
		this._stacks = value;
	}

	public applyToIncomingSpell(spell: Spell): void {
		for (let i = 0; i < this._stacks; i++) {
			this.incomingSpellModifiers.forEach((modifier) => {
				const spellProperty = get(spell, modifier.path);
				if (typeof spellProperty !== 'number') {
					return;
				}

				const result = this.modifyValue(spellProperty, modifier);
				set(spell, modifier.path, result);
			});
		}
	}

	public getStatus(): StatusEffectState {
		return {
			statusEffectId: this.statusEffectId,
			statusEffectTypeId: this.statusEffectTypeId,
			title: this.title,
			description: this.description,
			stacks: this._stacks,
		};
	}

	private modifyValue(value: number, modifier: StatusEffectModifier): number {
		switch (modifier.operation) {
			case 'add':
				return value + modifier.amount;
			case 'subtract':
				return value - modifier.amount;
			case 'multiply':
				return value * modifier.amount;
			case 'divide':
				return value / modifier.amount;
		}
	}

	private startInterval(): void {
		this._interval = setInterval(() => {
			console.log('status effect tick.');
			this._notify();
		}, this.intervalInMs);
	}

	public stopInterval(): void {
		if (this._interval) {
			clearInterval(this._interval);
			this._interval = undefined;
		}
	}

	private startTimeout(): void {
		this._timeout = setTimeout(() => {
			this.stopInterval();
			console.log('status effect expired.');
			this._notify();
		}, this.durationInMs);
	}

	public stopTimeout(): void {
		if (this._timeout) {
			clearTimeout(this._timeout);
			this._timeout = undefined;
		}
	}
}
