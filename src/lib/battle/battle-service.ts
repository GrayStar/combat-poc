import { cloneDeep } from 'lodash';
import { Battle, BATTLE_TYPE_ID, battleData, BattleInstance } from '@/lib/battle';

const battleStore: Record<string, { battle: BattleInstance; notify: () => void }> = {};

export const battleService = {
	getBattleOptions() {
		const data = cloneDeep(battleData);
		return Object.values(data);
	},
	createBattleByBattleTypeId(battleTypeId: BATTLE_TYPE_ID) {
		const battleConfig = cloneDeep(battleData[battleTypeId]);
		const { battle, notify, subscribe } = Battle(battleConfig);
		battleStore[battle.battleId] = { battle, notify };

		return { battle, subscribe };
	},
	getBattleByBattleId(battleId: string) {
		return battleStore[battleId];
	},
	deleteBattleByBattleId(battleId: string) {
		delete battleStore[battleId];
	},
	castSpell(battleId: string, data: { casterId: string; targetId: string; spellId: string }) {
		const { casterId, targetId, spellId } = data;
		const { battle, notify } = battleStore[battleId];

		const caster = battle.characters[casterId];
		const target = battle.characters[targetId];
		const spell = battle.spells[spellId];

		const spellManaCost = spell.casterEffects?.resources?.mana ?? 0;
		const castersNextManaValue = caster.mana + spellManaCost;
		if (castersNextManaValue <= 0) {
			return;
		}

		const damage = spell.targetEffects?.resources?.health ?? 0;

		caster.adjustMana(spellManaCost);
		target.adjustHealth(damage);
		spell.startCooldown();

		notify();
	},
};
