import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { BATTLE_TYPE_ID, battleData } from '@/lib/battle';
import { Character, CHARACTER_TYPE_ID, CharacterInstance } from '@/lib/character';
import { Spell, SpellInstance } from '@/lib/spell';
import { notificationPublisher } from '@/lib/battle/actions';

export type BattleInstance = ReturnType<typeof Battle>['battle'];

export const Battle = (battleTypeId: BATTLE_TYPE_ID) => {
	const battleConfig = cloneDeep(battleData[battleTypeId]);

	const battle = {
		battleId: uuidv4(),
		battleTypeId,
		title: battleConfig.title,
		playerCharacterId: '',
		friendlyNonPlayerCharacterIds: [] as string[],
		hostileNonPlayerCharacterIds: [] as string[],
		spells: {} as Record<string, SpellInstance>,
		characters: {} as Record<string, CharacterInstance>,
	};

	const { notify, subscribe } = notificationPublisher(battle);

	function setBattleCharactersAndSpells() {
		const playerCharacter = Character(battleConfig.playerCharacterTypeId);
		const friendlyNonPlayerRecord = getCharacterRecordByCharacterTypeId(
			battleConfig.friendlyNonPlayerCharacterTypeIds
		);
		const hostileNonPlayerRecord = getCharacterRecordByCharacterTypeId(
			battleConfig.hostileNonPlayerCharacterTypeIds
		);

		battle.playerCharacterId = playerCharacter.characterId;
		battle.friendlyNonPlayerCharacterIds = Object.keys(friendlyNonPlayerRecord);
		battle.hostileNonPlayerCharacterIds = Object.keys(hostileNonPlayerRecord);
		battle.characters = {
			[playerCharacter.characterId]: playerCharacter,
			...friendlyNonPlayerRecord,
			...hostileNonPlayerRecord,
		};

		const playerSpellRecord = getSpellsByCharacterInstance(battle.characters[battle.playerCharacterId], notify);
		battle.characters[battle.playerCharacterId].setSpellIds(Object.keys(playerSpellRecord));

		const friendlyNonPlayerSpellRecord = battle.friendlyNonPlayerCharacterIds.reduce(
			(accumulator, currentValue) => {
				const spellRecord = getSpellsByCharacterInstance(battle.characters[currentValue], notify);
				battle.characters[currentValue].setSpellIds(Object.keys(spellRecord));
				return {
					...accumulator,
					...spellRecord,
				};
			},
			{} as Record<string, SpellInstance>
		);
		const hostileNonPlayerSpellRecord = battle.hostileNonPlayerCharacterIds.reduce((accumulator, currentValue) => {
			const spellRecord = getSpellsByCharacterInstance(battle.characters[currentValue], notify);
			battle.characters[currentValue].setSpellIds(Object.keys(spellRecord));
			return {
				...accumulator,
				...spellRecord,
			};
		}, {} as Record<string, SpellInstance>);

		battle.spells = {
			...playerSpellRecord,
			...friendlyNonPlayerSpellRecord,
			...hostileNonPlayerSpellRecord,
		};
	}

	setBattleCharactersAndSpells();

	return {
		battle,
		notify,
		subscribe,
	};
};

const getCharacterRecordByCharacterTypeId = (characterTypeIds: CHARACTER_TYPE_ID[]) => {
	const characters = characterTypeIds.map((characterTypeId) => Character(characterTypeId));
	return characters.reduce(
		(accumulator, currentvalue) => ({
			...accumulator,
			[currentvalue.characterId]: currentvalue,
		}),
		{} as Record<string, CharacterInstance>
	);
};

const getSpellsByCharacterInstance = (character: CharacterInstance, notify: () => void) => {
	const spells = character.spellTypeIds.map((spellTypeId) => Spell(spellTypeId, notify));
	return spells.reduce(
		(accumulator, currentvalue) => ({
			...accumulator,
			[currentvalue.spellId]: currentvalue,
		}),
		{} as Record<string, SpellInstance>
	);
};
