import { Character } from '@/lib/character/character-class';

export abstract class SpellEffect {
	protected readonly _character: Character;

	constructor(character: Character) {
		this._character = character;
	}

	protected abstract _handleEffect(): void;
	public abstract getDescription(): string;
}
