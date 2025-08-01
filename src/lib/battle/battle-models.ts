import { BATTLE_TYPE_ID } from '@/lib/battle/battle-data';
import { CHARACTER_TYPE_ID } from '@/lib/character/character-data';

export interface BattleModel {
	battleTypeId: BATTLE_TYPE_ID;
	title: string;
	playerCharacterTypeId: CHARACTER_TYPE_ID;
	friendlyNonPlayerCharacterTypeIds: CHARACTER_TYPE_ID[];
	hostileNonPlayerCharacterTypeIds: CHARACTER_TYPE_ID[];
}

export interface CombatLogEntry {
	time: string;
	timeDescription: string;
	message: string;
}
