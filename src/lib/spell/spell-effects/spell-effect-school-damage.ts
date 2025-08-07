import { SCHOOL_TYPE_ID, SpellEffectDamageModel } from '@/lib/spell/spell-models';
import { SpellEffect } from '@/lib/spell/spell-effects/spell-effect';
import { Character } from '@/lib/character/character-class';

export class SpellEffectSchoolDamage extends SpellEffect {
	private readonly _schoolTypeId: SCHOOL_TYPE_ID;
	private readonly _value: number;

	constructor(config: SpellEffectDamageModel, character: Character, casterId: string) {
		super(character, casterId);

		this._schoolTypeId = config.schoolTypeId;
		this._value = config.value;

		this._handleEffect();
	}

	protected override _handleEffect() {
		this._character.adjustHealth(-this._value);

		if (this._character.characterId !== this._casterId) {
			this._character.adjustThreat(this._casterId, this._value);
		}

		console.log('School Damage:', this._value);
	}

	public override getDescription() {
		return `Deals [${this._value}] [${this._schoolTypeId}] damage.`;
	}
}
