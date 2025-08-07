import { Character } from '@/lib/character/character-class';
import { CHARACTER_TYPE_ID } from '@/lib/character/character-data';

export class CharacterNonPlayer extends Character {
	private _targetCharacterId: string = '';

	constructor(characterTypeId: CHARACTER_TYPE_ID, notify: () => void) {
		super(characterTypeId, notify);
	}

	protected override _determineTarget() {
		const threatEntries = Object.entries(this._threat);

		if (threatEntries.length <= 0) {
			this._targetCharacterId = '';
		}

		let [maxCharacterId, maxThreat] = threatEntries[0];

		for (const [currentCharacterId, currentThreat] of threatEntries) {
			if (currentThreat > maxThreat) {
				maxThreat = currentThreat;
				maxCharacterId = currentCharacterId;
			}
		}

		this._targetCharacterId = maxCharacterId;

		if (this._targetCharacterId) {
			this._startCombat();
		}
	}

	private _startCombat() {
		console.log('Starting combat with:', this._targetCharacterId, this._threat[this._targetCharacterId]);
	}
}
