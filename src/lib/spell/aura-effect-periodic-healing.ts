import { AuraEffectPeriodic } from '@/lib/spell/aura-effect-periodic';

export class AuraEffectPeriodicHealing extends AuraEffectPeriodic {
	protected override _handleIntervalTimerTick() {
		this.character.adjustHealth(this.value);

		console.log('Periodic Heal:', this.value);
	}

	public override getDescription() {
		return `Heals ${this.value} every ${this.intervalInMs}ms.`;
	}
}
