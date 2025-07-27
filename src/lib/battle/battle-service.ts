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
	castSpell(battleId: string, data: { casterId: string; targetId: string; spellId: string }) {
		const { casterId, targetId, spellId } = data;
		const battle = battleStore[battleId];

		const caster = battle.characters[casterId];
		const target = battle.characters[targetId];
		const spell = battle.spells[spellId];

		console.log('caster:', caster);
		console.log('target:', target);
		console.log('spell:', spell);
	},
};
