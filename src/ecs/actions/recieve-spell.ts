import { SpellInstance } from '@/lib/instances';
import { HealthAdjuster, ManaAdjuster } from '@/ecs/actions';

export type SpellRecieverSystems = {
	recieveSpell(spellInstance: SpellInstance): void;
};

export type SpellReciever<T, K> = T & K & SpellRecieverSystems;

export function spellReciever<T extends HealthAdjuster<K> & ManaAdjuster<K>, K>(entity: T): SpellReciever<T, K> {
	return {
		...entity,

		// components

		// systems
		recieveSpell(spellInstance: SpellInstance) {
			// TODO: apply entity status effcts (buffs/debuffs) to spell instance values before calculating amounts
			const healthAmount = spellInstance.targetEffects?.resources.health ?? 0;
			const manaAmount = spellInstance.targetEffects?.resources.mana ?? 0;

			this.adjustHealth(healthAmount);
			this.adjustMana(manaAmount);
		},
	};
}
