import { v4 as uuidv4 } from 'uuid';
import { BattleInstance, BattleModel, CHARACTER_TYPE_IDS, CharacterInstance } from '@/lib/models';
import { getCharacterInstance } from './character-utils';
import { characterData } from '@/lib/data';

export const getBattleInstance = (battle: BattleModel): BattleInstance => {
	return {
		battleId: uuidv4(),
		battleTypeId: battle.battleTypeId,
		title: battle.title,
		hostileCharacters: getCharacterRecord(battle.hostileCharacterTypeIds),
		friendlyCharacters: getCharacterRecord(battle.friendlyCharacterTypeIds),
	};
};

const getCharacterRecord = (characterTypeIds: CHARACTER_TYPE_IDS[]) => {
	return characterTypeIds.reduce((accumulator, currentValue) => {
		const characterConfig = characterData[currentValue];
		const characterInstance = getCharacterInstance(characterConfig);

		return {
			...accumulator,
			[characterInstance.characterId]: characterInstance,
		};
	}, {} as Record<string, CharacterInstance>);
};
