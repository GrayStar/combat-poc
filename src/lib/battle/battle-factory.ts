import { v4 as uuidv4 } from 'uuid';
import { BattleInstance, BattleModel } from '@/lib/battle';
import { Character, CHARACTER_TYPE_ID, CharacterInstance } from '@/lib/character';
import { SpellInstance } from '@/lib/models';

export const Battle = (battleConfig: BattleModel): BattleInstance => {
	const playerCharacter = Character(battleConfig.playerCharacterTypeId);
	const friendlyNonPlayerRecords = getCharacterAndSpellRecordsByCharacterTypeId(
		battleConfig.friendlyNonPlayerCharacterTypeIds
	);
	const hostileNonPlayerRecords = getCharacterAndSpellRecordsByCharacterTypeId(
		battleConfig.hostileNonPlayerCharacterTypeIds
	);

	const battle: BattleInstance = {
		battleId: uuidv4(),
		battleTypeId: battleConfig.battleTypeId,
		title: battleConfig.title,
		playerCharacterId: playerCharacter.character.characterId,
		friendlyNonPlayerCharacterIds: Object.keys(friendlyNonPlayerRecords.characterRecord),
		hostileNonPlayerCharacterIds: Object.keys(hostileNonPlayerRecords.characterRecord),
		spells: {
			...playerCharacter.characterSpellsBySpellId,
			...friendlyNonPlayerRecords.spellRecord,
			...hostileNonPlayerRecords.spellRecord,
		},
		characters: {
			[playerCharacter.character.characterId]: playerCharacter.character,
			...friendlyNonPlayerRecords.characterRecord,
			...hostileNonPlayerRecords.characterRecord,
		},
	};

	return battle;
};

const getCharacterAndSpellRecordsByCharacterTypeId = (characterTypeIds: CHARACTER_TYPE_ID[]) => {
	const characters = characterTypeIds.map((characterTypeId) => Character(characterTypeId));
	const characterRecord = characters.reduce((accumulator, currentvalue) => {
		return {
			...accumulator,
			[currentvalue.character.characterId]: currentvalue.character,
		};
	}, {} as Record<string, CharacterInstance>);
	const spellRecord = characters.reduce((accumulator, currentvalue) => {
		return {
			...accumulator,
			...currentvalue.characterSpellsBySpellId,
		};
	}, {} as Record<string, SpellInstance>);

	return {
		characterRecord,
		spellRecord,
	};
};
