import { v4 as uuidv4 } from 'uuid';
import { SpellInstance, STATUS_EFFECT_TYPE_ID, StatusEffectInstance } from '@/lib/models';
import { cloneDeep, get, set } from 'lodash';
import { statusEffectData } from '../data';

export const getStatusEffectInstance = (statusEffectTypeId: STATUS_EFFECT_TYPE_ID): StatusEffectInstance => {
	const statusEffectConfig = cloneDeep(statusEffectData[statusEffectTypeId]);

	return {
		...statusEffectConfig,
		statusEffectId: uuidv4(),
	};
};

export const applyStatusEffectToIncomingSpell = (statusEffect: StatusEffectInstance, spell: SpellInstance) => {
	const stackCount = statusEffect.stacks ?? 0;

	for (let i = 0; i < stackCount; i++) {
		statusEffect.incomingSpellModifiers.forEach((modifier) => {
			const spellProperty = get(spell, modifier.path);

			if (!spellProperty || typeof spellProperty !== 'number') {
				return;
			}

			const modiferOperationMap: Record<typeof modifier.operation, (value: number) => number> = {
				add: (value) => {
					return value + modifier.amount;
				},
				subtract: (value) => {
					return value - modifier.amount;
				},
				multiply: (value) => {
					return value * modifier.amount;
				},
				divide: (value) => {
					return value / modifier.amount;
				},
			};

			const result = modiferOperationMap[modifier.operation](spellProperty);
			set(spell, modifier.path, result);
		});
	}
};
