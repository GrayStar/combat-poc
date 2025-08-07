import { Character } from '@/lib/character/character-class';
import { CHARACTER_TYPE_ID } from '@/lib/data/enums';
import { BattleFunctions } from '../battle/battle-class';

export class CharacterPlayer extends Character {
	constructor(characterTypeId: CHARACTER_TYPE_ID, battleFuctions: BattleFunctions) {
		super(characterTypeId, battleFuctions);
	}

	protected override _determineTarget() {
		return;
	}

	protected override _dieTriggerSideEffects() {
		return;
	}
}
