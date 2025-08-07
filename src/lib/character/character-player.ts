import { Character } from '@/lib/character/character-class';
import { CHARACTER_TYPE_ID } from '@/lib/character/character-data';

export class CharacterPlayer extends Character {
	constructor(characterTypeId: CHARACTER_TYPE_ID, notify: () => void) {
		super(characterTypeId, notify);
	}

	protected override _determineTarget() {
		return;
	}

	protected override _dieTriggerSideEffects() {
		return;
	}
}
