import {
	PERIODIC_EFFECT_TYPE_ID,
	PeriodicEffectModel,
	SCHOOL_TYPE_ID,
	SpellEffectValueModifier,
} from '@/lib/spell/spell-models';
import { AuraEffect } from '@/lib/spell/aura-effects/aura-effect';
import { Character } from '@/lib/character/character-class';

export abstract class AuraEffectPeriodic extends AuraEffect {
	protected readonly _periodicEffectTypeId: PERIODIC_EFFECT_TYPE_ID;
	protected readonly _schoolTypeId: SCHOOL_TYPE_ID;
	protected readonly _intervalInMs: number;
	protected readonly _value: number;
	protected readonly _valueModifiers: SpellEffectValueModifier[];

	private _intervalTimer: ReturnType<typeof setInterval> | undefined = undefined;

	constructor(config: PeriodicEffectModel, character: Character, casterId: string) {
		super(character, casterId);

		this._periodicEffectTypeId = config.periodicEffectTypeId;
		this._intervalInMs = config.intervalInMs;
		this._schoolTypeId = config.schoolTypeId;
		this._value = config.value;
		this._valueModifiers = config.valueModifiers;
	}

	protected abstract _handleIntervalTimerTick(): void;

	public startInterval() {
		this.stopInterval();
		this._intervalTimer = setInterval(this._handleIntervalTimerTick.bind(this), this._intervalInMs);
	}

	public stopInterval() {
		if (!this._intervalTimer) {
			return;
		}

		clearInterval(this._intervalTimer);
		this._intervalTimer = undefined;
	}

	protected abstract _combatLogEntry(): void;
}
