import { v4 as uuidv4 } from 'uuid';
import { CHARACTER_TYPE_ID, CharacterInstance } from '@/lib/models';
import { getCharacterInstance } from '@/lib/utils';
import { BattleInstance, BattleModel } from '@/lib/battle';

export const Battle = (battleConfig: BattleModel): BattleInstance => {
	const playerCharacter = getCharacterInstance(battleConfig.playerCharacterTypeId);
	const friendlyNonPlayerCharacters = getRecordOfCharacterInstancesByCharacterTypeId(
		battleConfig.friendlyNonPlayerCharacterTypeIds
	);
	const hostileNonPlayerCharacters = getRecordOfCharacterInstancesByCharacterTypeId(
		battleConfig.hostileNonPlayerCharacterTypeIds
	);

	const battle: BattleInstance = {
		battleId: uuidv4(),
		battleTypeId: battleConfig.battleTypeId,
		title: battleConfig.title,
		playerCharacterId: playerCharacter.characterId,
		friendlyNonPlayerCharacterIds: Object.keys(friendlyNonPlayerCharacters),
		hostileNonPlayerCharacterIds: Object.keys(hostileNonPlayerCharacters),
		characters: {
			[playerCharacter.characterId]: playerCharacter,
			...friendlyNonPlayerCharacters,
			...hostileNonPlayerCharacters,
		},
	};

	return battle;
};

const getRecordOfCharacterInstancesByCharacterTypeId = (characterTypeIds: CHARACTER_TYPE_ID[]) => {
	return characterTypeIds.reduce((accumulator, currentValue) => {
		const characterInstance = getCharacterInstance(currentValue);

		return {
			...accumulator,
			[characterInstance.characterId]: characterInstance,
		};
	}, {} as Record<string, CharacterInstance>);
};
