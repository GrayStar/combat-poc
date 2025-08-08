import { SpellEffectInterruptModel } from '@/lib/spell/spell-models';
import { SpellEffect } from '@/lib/spell/spell-effects/spell-effect';
import { Character } from '@/lib/character/character-class';

export class SpellEffectInterrupt extends SpellEffect {
	constructor(_config: SpellEffectInterruptModel, character: Character, casterId: string) {
		super(character, casterId);

		this._handleEffect();
		this._combatLogEntry();
	}

	protected override _handleEffect() {
		this._character.interuptCasting();
	}

	protected override _combatLogEntry() {
		this._character.battle.addCombatLogMessage(`${this._character.title} was interrupted.`);
	}
}
