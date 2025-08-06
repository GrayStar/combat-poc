import { SCHOOL_TYPE_ID, SpellEffectSchoolDamageModel } from '@/lib/spell/spell-models';
import { Character } from '@/lib/character/character-class';
import { SpellEffect } from '@/lib/spell/spell-effects/spell-effect';

export class SpellEffectSchoolDamage extends SpellEffect {
	private readonly _schoolTypeId: SCHOOL_TYPE_ID;
	private readonly _value: number;

	constructor(config: SpellEffectSchoolDamageModel, character: Character) {
		super(character);

		this._schoolTypeId = config.schoolTypeId;
		this._value = config.value;

		this._handleEffect();
	}

	protected override _handleEffect() {
		this._character.adjustHealth(-this._value);

		console.log('School Damage:', this._value);
	}

	public override getDescription() {
		return `Deals [${this._value}] [${this._schoolTypeId}] damage.`;
	}
}
