import { cloneDeep } from 'lodash';
import { Battle, BATTLE_TYPE_ID, battleData, BattleInstance } from '@/lib/battle';

const battleStore: Record<string, BattleInstance> = {};

export const battleService = {
	getBattleOptions() {
		const data = cloneDeep(battleData);
		return Object.values(data);
	},
	createBattleByBattleTypeId(battleTypeId: BATTLE_TYPE_ID) {
		const battleConfig = cloneDeep(battleData[battleTypeId]);
		const battle = Battle(battleConfig);
		battleStore[battle.battleId] = battle;

		return battle;
	},
	getBattleByBattleId(battleId: string) {
		return battleStore[battleId];
	},
	deleteBattleByBattleId(battleId: string) {
		delete battleStore[battleId];
	},
};
