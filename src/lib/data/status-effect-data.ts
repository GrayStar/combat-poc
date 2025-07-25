import { SPELL_TYPE_ID, STATUS_EFFECT_TYPE_ID, StatusEffectModel } from '../models';

export const statusEffectData: Record<STATUS_EFFECT_TYPE_ID, StatusEffectModel> = {
	[STATUS_EFFECT_TYPE_ID.BURN]: {
		statusEffectTypeId: STATUS_EFFECT_TYPE_ID.BURN,
		title: 'Burn',
		description: 'Burn the target.',
		duration: 5000,
		interval: 1000,
		outgoingSpellModifiers: [],
		incomingSpellModifiers: [],
		intervalSpellTypeIds: [SPELL_TYPE_ID.BURN_TICK],
		timeoutSpellTypeIds: [SPELL_TYPE_ID.SCAR],
		clearedSpellTypeIds: [],
	},
	[STATUS_EFFECT_TYPE_ID.SCARRED]: {
		statusEffectTypeId: STATUS_EFFECT_TYPE_ID.SCARRED,
		title: 'Scarred',
		description: 'A scar that is sensitive to the touch, increases all damage taken.',
		duration: 10000,
		interval: 0,
		outgoingSpellModifiers: [],
		incomingSpellModifiers: [
			{
				property: ['targetEffects', 'resources', 'health'],
				operation: 'multiply',
				amount: 2,
			},
		],
		intervalSpellTypeIds: [],
		timeoutSpellTypeIds: [],
		clearedSpellTypeIds: [],
	},
};
