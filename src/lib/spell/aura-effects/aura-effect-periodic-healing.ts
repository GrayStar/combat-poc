import { AuraEffectPeriodic } from '@/lib/spell/aura-effects/aura-effect-periodic';

export class AuraEffectPeriodicHealing extends AuraEffectPeriodic {
	protected override _handleIntervalTimerTick() {
		this._character.adjustHealth(this.value);

		console.log('Periodic Heal:', this.value);
	}

	public override getDescription() {
		return `Heals ${this.value} every ${this.intervalInMs}ms.`;
	}
}
