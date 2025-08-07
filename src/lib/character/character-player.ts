import { Character } from '@/lib/character/character-class';
import { CHARACTER_TYPE_ID } from '@/lib/data/enums';
import { Battle } from '@/lib/battle/battle-class';

export class CharacterPlayer extends Character {
	constructor(characterTypeId: CHARACTER_TYPE_ID, battle: Battle) {
		super(characterTypeId, battle);
	}

	protected override _determineTarget() {
		return;
	}

	protected override _dieTriggerSideEffects() {
		return;
	}
}
