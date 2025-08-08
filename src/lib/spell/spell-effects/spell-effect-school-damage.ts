import { SCHOOL_TYPE_ID, SpellEffectDamageModel } from '@/lib/spell/spell-models';
import { SpellEffect } from '@/lib/spell/spell-effects/spell-effect';
import { Character } from '@/lib/character/character-class';

export class SpellEffectSchoolDamage extends SpellEffect {
	private readonly _value: number;
	private readonly _schoolTypeId: SCHOOL_TYPE_ID;

	constructor(config: SpellEffectDamageModel, character: Character, casterId: string) {
		super(character, casterId);

		this._value = config.value;
		this._schoolTypeId = config.schoolTypeId;

		this._combatLogEntry();
		this._handleEffect();
	}

	protected override _handleEffect() {
		this._character.adjustHealth(-this._value);
		this._character.adjustThreat(this._casterId, this._value);
	}

	protected override _combatLogEntry() {
		this._character.battle.addCombatLogMessage(
			`${this._character.title} took ${this._value} ${this._schoolTypeId} damage.`
		);
	}
}
