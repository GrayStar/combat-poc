import { Character } from '@/lib/character/character-class';

export abstract class SpellEffect {
	protected readonly _character: Character;
	protected readonly _casterId: string;

	constructor(character: Character, casterId: string) {
		this._character = character;
		this._casterId = casterId;
	}

	protected abstract _handleEffect(): void;
	protected abstract _combatLogEntry(): void;

	protected _getAoeTargets(): Character[] {
		const { battle } = this._character;

		const isFriendly =
			battle.friendlyNonPlayerCharacterIds.includes(this._character.characterId) ||
			battle.playerCharacterId === this._character.characterId;

		const aoeTargetIds = isFriendly
			? [...battle.friendlyNonPlayerCharacterIds, battle.playerCharacterId]
			: battle.hostileNonPlayerCharacterIds;

		return aoeTargetIds.map((targetId) => battle.characters[targetId]);
	}
}
