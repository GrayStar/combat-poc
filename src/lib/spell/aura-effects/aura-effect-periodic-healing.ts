import { AuraEffectPeriodic } from '@/lib/spell/aura-effects/aura-effect-periodic';

export class AuraEffectPeriodicHealing extends AuraEffectPeriodic {
	protected override _handleIntervalTimerTick() {
		this._character.adjustHealth(this._value);
		this._combatLogEntry();
	}

	public override getDescription() {
		return `Heals ${this._value} every ${this._intervalInMs}ms.`;
	}

	protected override _combatLogEntry() {
		this._character.battle.addCombatLogMessage(`${this._character.title} was healed for ${this._value}.`);
	}
}
