import { BATTLE_TYPE_ID } from '@/lib/battle';
import { CHARACTER_TYPE_ID } from '@/lib/character';

export interface BattleModel {
	battleTypeId: BATTLE_TYPE_ID;
	title: string;
	playerCharacterTypeId: CHARACTER_TYPE_ID;
	friendlyNonPlayerCharacterTypeIds: CHARACTER_TYPE_ID[];
	hostileNonPlayerCharacterTypeIds: CHARACTER_TYPE_ID[];
}
