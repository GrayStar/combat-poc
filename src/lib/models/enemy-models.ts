export enum ENEMY_TYPE_IDS {
	SKELETON = 'SKELETON',
	SPIDER = 'SPIDER',
}

export interface EnemyModel {
	enemyTypeId: string;
	title: string;
	maxHealth: number;
}
