import { ENEMY_TYPE_IDS } from '@/lib/models';

export enum BATTLE_IDS {
	TUTORIAL = 'TUTORIAL',
	FIRST_BATTLE = 'FIRST_BATTLE',
}

export interface BattleModel {
	battleId: string;
	title: string;
	enemyTypeIds: ENEMY_TYPE_IDS[];
}
