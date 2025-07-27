import { CHARACTER_TYPE_ID, CharacterInstance } from '@/lib/models';
import { BATTLE_TYPE_ID } from '@/lib/battle';

export interface BattleModel {
	battleTypeId: BATTLE_TYPE_ID;
	title: string;
	playerCharacterTypeId: CHARACTER_TYPE_ID;
	friendlyNonPlayerCharacterTypeIds: CHARACTER_TYPE_ID[];
	hostileNonPlayerCharacterTypeIds: CHARACTER_TYPE_ID[];
}

export interface BattleInstance {
	battleId: string;
	battleTypeId: BATTLE_TYPE_ID;
	title: string;
	characters: Record<string, CharacterInstance>;
	playerCharacterId: string;
	friendlyNonPlayerCharacterIds: string[];
	hostileNonPlayerCharacterIds: string[];
}
