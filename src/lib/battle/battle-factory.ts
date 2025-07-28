import { v4 as uuidv4 } from 'uuid';
import { BattleInstance, BattleModel } from '@/lib/battle';
import { Character, CHARACTER_TYPE_ID, CharacterInstance } from '@/lib/character';
import { SpellInstance } from '@/lib/spell';

type NotificationSubscriber = (state: BattleInstance) => void;

export const Battle = (battleConfig: BattleModel) => {
	const notificationSubscribers = new Set<NotificationSubscriber>();
	function notify() {
		for (const notificationSubscriber of notificationSubscribers) {
			try {
				notificationSubscriber(battle);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('subscriber threw:', error);
			}
		}
	}

	const playerCharacter = Character(battleConfig.playerCharacterTypeId, notify);
	const friendlyNonPlayerRecords = getCharacterAndSpellRecordsByCharacterTypeId(
		battleConfig.friendlyNonPlayerCharacterTypeIds,
		notify
	);
	const hostileNonPlayerRecords = getCharacterAndSpellRecordsByCharacterTypeId(
		battleConfig.hostileNonPlayerCharacterTypeIds,
		notify
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

	return {
		battle,
		notify,
		subscribe(notificationSubscriber: NotificationSubscriber): () => void {
			notificationSubscribers.add(notificationSubscriber);
			notificationSubscriber(battle);
			return () => {
				notificationSubscribers.delete(notificationSubscriber);
			};
		},
	};
};

const getCharacterAndSpellRecordsByCharacterTypeId = (characterTypeIds: CHARACTER_TYPE_ID[], notify: () => void) => {
	const characters = characterTypeIds.map((characterTypeId) => Character(characterTypeId, notify));
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
