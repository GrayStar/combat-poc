import { BATTLE_TYPE_ID } from '@/lib/battle';
import { CHARACTER_TYPE_ID, CharacterInstance } from '@/lib/character';
import { SpellInstance } from '@/lib/spell';

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
	spells: Record<string, SpellInstance>;
	playerCharacterId: string;
	friendlyNonPlayerCharacterIds: string[];
	hostileNonPlayerCharacterIds: string[];
}
