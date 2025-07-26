import { v4 as uuidv4 } from 'uuid';
import { BattleInstance, BattleModel, CHARACTER_TYPE_IDS, CharacterInstance } from '@/lib/models';
import { getCharacterInstance } from './character-utils';

export const getBattleInstance = (battle: BattleModel): BattleInstance => {
	const battleInstance = {
		battleId: uuidv4(),
		battleTypeId: battle.battleTypeId,
		title: battle.title,
		hostileCharacters: getCharacterRecord(battle.hostileCharacterTypeIds),
		friendlyCharacters: getCharacterRecord(battle.friendlyCharacterTypeIds),
	};

	return battleInstance;
};

const getCharacterRecord = (characterTypeIds: CHARACTER_TYPE_IDS[]) => {
	return characterTypeIds.reduce((accumulator, currentValue) => {
		const characterInstance = getCharacterInstance(currentValue);

		return {
			...accumulator,
			[characterInstance.characterId]: characterInstance,
		};
	}, {} as Record<string, CharacterInstance>);
};
