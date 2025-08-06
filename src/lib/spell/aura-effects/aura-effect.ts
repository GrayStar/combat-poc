import { Character } from '@/lib/character/character-class';

export abstract class AuraEffect {
	protected readonly _character: Character;

	constructor(character: Character) {
		this._character = character;
	}

	public abstract getDescription(): string;
}
