import { AuraEffectPeriodic } from '@/lib/spell/aura-effects/aura-effect-periodic';

export class AuraEffectPeriodicDamage extends AuraEffectPeriodic {
	protected override _handleIntervalTimerTick() {
		this._character.adjustHealth(-this._value);

		if (this._character.characterId !== this._casterId) {
			this._character.adjustThreat(this._casterId, this._value);
		}

		console.log('Periodic Damage:', this._value);
	}

	public override getDescription() {
		return `Deals ${this._value} damage every ${this._intervalInMs}ms.`;
	}
}
