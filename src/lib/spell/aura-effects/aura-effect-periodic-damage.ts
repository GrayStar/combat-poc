import { AuraEffectPeriodic } from '@/lib/spell/aura-effects/aura-effect-periodic';

export class AuraEffectPeriodicDamage extends AuraEffectPeriodic {
	protected override _handleIntervalTimerTick() {
		this._character.adjustHealth(-this._value);

		if (this._character.characterId !== this._casterId) {
			this._character.adjustThreat(this._casterId, this._value);
		}

		this._combatLogEntry();
	}

	public override getDescription() {
		return `Deals ${this._value} damage every ${this._intervalInMs}ms.`;
	}

	protected override _combatLogEntry() {
		this._character.battle.addCombatLogMessage(
			`${this._character.title} took ${this._value} ${this._schoolTypeId} damage.`
		);
	}
}
