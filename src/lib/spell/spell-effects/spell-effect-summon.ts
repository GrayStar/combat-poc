import { SpellEffectSummonModel } from '@/lib/spell/spell-models';
import { SpellEffect } from '@/lib/spell/spell-effects/spell-effect';
import { Character } from '@/lib/character/character-class';
import { CHARACTER_TYPE_ID } from '@/lib/data/enums';

export class SpellEffectSummon extends SpellEffect {
	private readonly _value: number;
	private readonly _characterTypeId: CHARACTER_TYPE_ID;
	private readonly _targetId: string;

	constructor(config: SpellEffectSummonModel, character: Character, casterId: string) {
		super(character, casterId);

		(this._value = config.value), (this._characterTypeId = config.characterTypeId);
		this._targetId = character.characterId;

		this._handleEffect();
	}

	protected override _handleEffect() {
		for (let i = 0; i < this._value; i++) {
			this._character.summonAlly({ characterTypeId: this._characterTypeId, targetId: this._targetId });
		}
	}
}
