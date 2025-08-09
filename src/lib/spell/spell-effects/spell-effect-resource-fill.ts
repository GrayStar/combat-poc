import { RESOURCE_TYPE_ID, SpellEffectResourceFillModel } from '@/lib/spell/spell-models';
import { SpellEffect } from '@/lib/spell/spell-effects/spell-effect';
import { Character } from '@/lib/character/character-class';

export class SpellEffectResourceFill extends SpellEffect {
	private readonly _value: number;
	private readonly _resourceTypeId: RESOURCE_TYPE_ID;

	constructor(config: SpellEffectResourceFillModel, character: Character, casterId: string) {
		super(character, casterId);

		this._value = config.value;
		this._resourceTypeId = config.resourceTypeId;

		this._combatLogEntry();
		this._handleEffect();
	}

	protected override _handleEffect() {
		if (this._resourceTypeId === RESOURCE_TYPE_ID.HEALTH) {
			this._character.adjustHealth(this._value);
			return;
		}
		if (this._resourceTypeId === RESOURCE_TYPE_ID.MANA) {
			this._character.adjustMana(this._value);
			return;
		}
	}

	protected override _combatLogEntry() {
		this._character.battle.addCombatLogMessage(
			`${this._character.title} restored ${this._value} ${this._resourceTypeId}.`
		);
	}
}
