import { AuraEffectPeriodic } from '@/lib/spell/aura-effects/aura-effect-periodic';

export class AuraEffectPeriodicHealing extends AuraEffectPeriodic {
	protected override _handleIntervalTimerTick() {
		this._character.adjustHealth(this._value);

		console.log('Periodic Heal:', this._value);
	}

	public override getDescription() {
		return `Heals ${this._value} every ${this._intervalInMs}ms.`;
	}
}
