import { cloneDeep } from 'lodash';
import { Battle, BATTLE_TYPE_ID, battleData } from '@/lib/battle';

const battleStore: Record<string, Battle> = {};

export const battleService = {
	getBattleOptions() {
		const data = cloneDeep(battleData);
		return Object.values(data);
	},
	createBattleByBattleTypeId(battleTypeId: BATTLE_TYPE_ID) {
		const battle = new Battle(battleTypeId);
		battleStore[battle.battleId] = battle;

		return {
			battle: battle.getState(),
			subscribe: battle.subscribe,
		};
	},
	getBattleByBattleId(battleId: string) {
		return battleStore[battleId];
	},
	deleteBattleByBattleId(battleId: string) {
		delete battleStore[battleId];
	},
	castSpell(battleId: string, data: { casterId: string; targetId: string; spellId: string }) {
		const battle = battleStore[battleId];
		battle.handleCastSpell(data);
	},
};
