import { AuraEffectPeriodic } from '@/lib/spell/aura-effects/aura-effect-periodic';

export class AuraEffectPeriodicDamage extends AuraEffectPeriodic {
	protected override _handleIntervalTimerTick() {
		this._character.adjustHealth(-this.value);

		console.log('Periodic Damage:', this.value);
	}

	public override getDescription() {
		return `Deals ${this.value} damage every ${this.intervalInMs}ms.`;
	}
}
