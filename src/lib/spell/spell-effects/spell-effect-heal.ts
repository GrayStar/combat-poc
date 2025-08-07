import { SpellEffectHealModel } from '@/lib/spell/spell-models';
import { SpellEffect } from '@/lib/spell/spell-effects/spell-effect';
import { Character } from '@/lib/character/character-class';

export class SpellEffectHeal extends SpellEffect {
	private readonly _value: number;

	constructor(config: SpellEffectHealModel, character: Character, casterId: string) {
		super(character, casterId);

		this._value = config.value;

		this._handleEffect();
	}

	protected override _handleEffect() {
		this._character.adjustHealth(this._value);

		console.log('Heal:', this._value);
	}
}
