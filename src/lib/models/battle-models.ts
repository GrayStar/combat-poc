import { CharacterInstance } from '@/ecs/entities';
import { CHARACTER_TYPE_IDS } from '@/lib/models';

export enum BATTLE_IDS {
	TUTORIAL = 'TUTORIAL',
	FIRST_BATTLE = 'FIRST_BATTLE',
}

export interface BattleModel {
	battleId: BATTLE_IDS;
	title: string;
	enemyTypeIds: CHARACTER_TYPE_IDS[];
}

export type BattleComposite = BattleModel & {
	id: string;
	hostileCharacters: Record<string, CharacterInstance>;
	friendlyCharacters: Record<string, CharacterInstance>;
};
