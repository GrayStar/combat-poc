export enum ENEMY_IDS {
	SKELETON = 'SKELETON',
	SPIDER = 'SPIDER',
}

export interface EnemyModel {
	enemyId: string;
	title: string;
	maxHealth: number;
}
