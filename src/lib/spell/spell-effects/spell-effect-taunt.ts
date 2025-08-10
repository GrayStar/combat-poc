import { SpellEffectTauntModel } from '@/lib/spell/spell-models';
import { SpellEffect } from '@/lib/spell/spell-effects/spell-effect';
import { Character } from '@/lib/character/character-class';

export class SpellEffectTaunt extends SpellEffect {
	private readonly _value: number;
	private readonly _aoe: boolean;

	constructor(config: SpellEffectTauntModel, character: Character, casterId: string) {
		super(character, casterId);

		this._value = config.value;
		this._aoe = config.aoe;

		this._combatLogEntry();
		this._handleEffect();
	}

	protected override _handleEffect() {
		if (this._aoe) {
			this._getAoeTargets().forEach((c) => {
				c.adjustThreat(this._casterId, this._value);
			});

			return;
		}

		this._character.adjustThreat(this._casterId, this._value);
	}

	protected override _combatLogEntry() {
		this._character.battle.addCombatLogMessage(
			`${this._casterId} generated ${this._value} threat on ${this._character.title}.`
		);
	}
}
