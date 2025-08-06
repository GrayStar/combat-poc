import {
	PERIODIC_EFFECT_TYPE_ID,
	PeriodicEffectModel,
	SCHOOL_TYPE_ID,
	SpellEffectValueModifier,
} from '@/lib/spell/spell-models';
import { Character } from '@/lib/character/character-class';
import { AuraEffect } from '@/lib/spell/aura-effects/aura-effect';

export abstract class AuraEffectPeriodic extends AuraEffect {
	protected readonly periodicEffectTypeId: PERIODIC_EFFECT_TYPE_ID;
	protected readonly schoolTypeId: SCHOOL_TYPE_ID;
	protected readonly intervalInMs: number;
	protected readonly value: number;
	protected readonly valueModifiers: SpellEffectValueModifier[];

	private _intervalTimer: ReturnType<typeof setInterval> | undefined = undefined;

	constructor(config: PeriodicEffectModel, character: Character) {
		super(character);

		this.periodicEffectTypeId = config.periodicEffectTypeId;
		this.intervalInMs = config.intervalInMs;
		this.schoolTypeId = config.schoolTypeId;
		this.value = config.value;
		this.valueModifiers = config.valueModifiers;
	}

	protected abstract _handleIntervalTimerTick(): void;

	public startInterval() {
		this.stopInterval();
		this._intervalTimer = setInterval(this._handleIntervalTimerTick.bind(this), this.intervalInMs);
	}

	public stopInterval() {
		if (!this._intervalTimer) {
			return;
		}

		clearInterval(this._intervalTimer);
		this._intervalTimer = undefined;
	}
}
