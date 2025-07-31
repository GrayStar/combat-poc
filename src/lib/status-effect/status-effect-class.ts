// import { v4 as uuidv4 } from 'uuid';
// import { cloneDeep, get, set } from 'lodash';
// import { SPELL_TYPE_ID, STATUS_EFFECT_TYPE_ID, statusEffectData, StatusEffectModifier } from '@/lib/status-effect';
// import { Spell } from '@/lib/spell';

// export type StatusEffectState = {
// 	statusEffectId: string;
// 	statusEffectTypeId: STATUS_EFFECT_TYPE_ID;
// 	title: string;
// 	description: string;
// 	durationInMs: number;
// 	intervalInMs: number;
// 	outgoingSpellModifiers: StatusEffectModifier[];
// 	incomingSpellModifiers: StatusEffectModifier[];
// 	intervalSpellTypeIds: SPELL_TYPE_ID[];
// 	timeoutSpellTypeIds: SPELL_TYPE_ID[];
// 	clearedSpellTypeIds: SPELL_TYPE_ID[];
// 	stacks: number;
// };

// export class StatusEffect {
// 	public readonly statusEffectId: string;
// 	public readonly statusEffectTypeId: STATUS_EFFECT_TYPE_ID;
// 	public readonly title: string;
// 	public readonly description: string;
// 	public readonly durationInMs: number;
// 	public readonly intervalInMs: number;
// 	public readonly outgoingSpellModifiers: StatusEffectModifier[];
// 	public readonly incomingSpellModifiers: StatusEffectModifier[];
// 	public readonly intervalSpellTypeIds: SPELL_TYPE_ID[];
// 	public readonly timeoutSpellTypeIds: SPELL_TYPE_ID[];
// 	public readonly clearedSpellTypeIds: SPELL_TYPE_ID[];
// 	public readonly canStack: boolean;

// 	private _stacks: number = 0;
// 	private _interval?: NodeJS.Timeout;
// 	private _timeout?: NodeJS.Timeout;

// 	constructor(
// 		statusEffectTypeId: STATUS_EFFECT_TYPE_ID,
// 		private readonly intervalCallback: (statusEffectId: string) => void,
// 		private readonly timeoutCallback: (statusEffectId: string) => void
// 	) {
// 		const config = cloneDeep(statusEffectData[statusEffectTypeId]);

// 		this.statusEffectId = uuidv4();
// 		this.statusEffectTypeId = statusEffectTypeId;
// 		this.title = config.title;
// 		this.description = config.description;
// 		this.durationInMs = config.durationInMs;
// 		this.intervalInMs = config.intervalInMs;
// 		this.outgoingSpellModifiers = config.outgoingSpellModifiers;
// 		this.incomingSpellModifiers = config.incomingSpellModifiers;
// 		this.intervalSpellTypeIds = config.intervalSpellTypeIds;
// 		this.timeoutSpellTypeIds = config.timeoutSpellTypeIds;
// 		this.clearedSpellTypeIds = config.clearedSpellTypeIds;
// 		this.canStack = config.canStack;

// 		if (this.intervalInMs > 0) {
// 			this.startInterval();
// 		}
// 		this.startTimeout();
// 	}

// 	public get stacks(): number {
// 		return this._stacks;
// 	}

// 	public set stacks(value: number) {
// 		this._stacks = value;
// 	}

// 	public applyToIncomingSpell(spell: Spell): void {
// 		for (let i = 0; i < this._stacks; i++) {
// 			this.incomingSpellModifiers.forEach((modifier) => {
// 				const spellProperty = get(spell, modifier.path);
// 				if (typeof spellProperty !== 'number') {
// 					return;
// 				}

// 				const result = this.modifyValue(spellProperty, modifier);
// 				set(spell, modifier.path, result);
// 			});
// 		}
// 	}

// 	private modifyValue(value: number, modifier: StatusEffectModifier): number {
// 		switch (modifier.operation) {
// 			case 'add':
// 				return value + modifier.amount;
// 			case 'subtract':
// 				return value - modifier.amount;
// 			case 'multiply':
// 				return value * modifier.amount;
// 			case 'divide':
// 				return value / modifier.amount;
// 		}
// 	}

// 	private startInterval(): void {
// 		if (this._interval) {
// 			this.stopInterval();
// 		}

// 		this._interval = setInterval(() => {
// 			this.intervalCallback(this.statusEffectId);
// 		}, this.intervalInMs);
// 	}

// 	public stopInterval(): void {
// 		if (this._interval) {
// 			clearInterval(this._interval);
// 			this._interval = undefined;
// 		}
// 	}

// 	private startTimeout(): void {
// 		if (this._timeout) {
// 			this.stopTimeout();
// 		}

// 		this._timeout = setTimeout(() => {
// 			this.stopInterval();
// 			this.timeoutCallback(this.statusEffectId);
// 		}, this.durationInMs);
// 	}

// 	public stopTimeout(): void {
// 		if (this._timeout) {
// 			clearTimeout(this._timeout);
// 			this._timeout = undefined;
// 		}
// 	}

// 	public stopAllTimers(): void {
// 		this.stopInterval();
// 		this.stopTimeout();
// 	}

// 	public getState(): StatusEffectState {
// 		return {
// 			statusEffectId: this.statusEffectId,
// 			statusEffectTypeId: this.statusEffectTypeId,
// 			title: this.title,
// 			description: this.description,
// 			durationInMs: this.durationInMs,
// 			intervalInMs: this.intervalInMs,
// 			outgoingSpellModifiers: this.outgoingSpellModifiers,
// 			incomingSpellModifiers: this.incomingSpellModifiers,
// 			intervalSpellTypeIds: this.intervalSpellTypeIds,
// 			timeoutSpellTypeIds: this.timeoutSpellTypeIds,
// 			clearedSpellTypeIds: this.clearedSpellTypeIds,
// 			stacks: this._stacks,
// 		};
// 	}
// }
