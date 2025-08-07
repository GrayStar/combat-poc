import { Character } from '@/lib/character/character-class';

export abstract class SpellEffect {
	protected readonly _character: Character;
	protected readonly _casterId: string;

	constructor(character: Character, casterId: string) {
		this._character = character;
		this._casterId = casterId;
	}

	protected abstract _handleEffect(): void;
}
