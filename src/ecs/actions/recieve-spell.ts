import { SpellInstance } from '@/lib/instances';
import { HealthAdjuster, ManaAdjuster, StatusEffectsApplier } from '@/ecs/actions';

export type SpellRecieverSystems = {
	recieveSpell(spellInstance: SpellInstance): void;
};

export type SpellReciever<T, K> = T & K & SpellRecieverSystems;

export function spellReciever<T extends HealthAdjuster<K> & ManaAdjuster<K> & StatusEffectsApplier<K>, K>(
	entity: T
): SpellReciever<T, K> {
	return {
		...entity,

		// components

		// systems
		recieveSpell(spellInstance: SpellInstance) {
			const spellWithStatusEffects = this.applyStatusEffectsToIncomingSpell(spellInstance);

			const healthAmount = spellWithStatusEffects.targetEffects?.resources?.health ?? 0;
			const manaAmount = spellWithStatusEffects.targetEffects?.resources?.mana ?? 0;

			this.adjustHealth(healthAmount);
			this.adjustMana(manaAmount);

			const statusEffectIdsToAdd = spellInstance.targetEffects?.statusEffectsToAdd ?? [];
			statusEffectIdsToAdd.forEach((statusEffectId) => this.getStatusEffect(statusEffectId));
		},
	};
}
