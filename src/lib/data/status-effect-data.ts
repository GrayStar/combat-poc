import { SPELL_TYPE_ID, STATUS_EFFECT_TYPE_ID, StatusEffectModel } from '../models';

export const statusEffectData: Record<STATUS_EFFECT_TYPE_ID, StatusEffectModel> = {
	[STATUS_EFFECT_TYPE_ID.BURN]: {
		statusEffectTypeId: STATUS_EFFECT_TYPE_ID.BURN,
		title: 'Burn',
		description: 'Burn the target.',
		duration: 4000,
		interval: 1000,
		outgoingSpellModifiers: [],
		incomingSpellModifiers: [],
		intervalSpellTypeIds: [SPELL_TYPE_ID.BURN_TICK],
		timeoutSpellTypeIds: [],
		clearedSpellTypeIds: [],
		canStack: false,
	},
	[STATUS_EFFECT_TYPE_ID.SCARRED]: {
		statusEffectTypeId: STATUS_EFFECT_TYPE_ID.SCARRED,
		title: 'Scarred',
		description: 'Increases all damage taken.',
		duration: 6000,
		interval: 0,
		outgoingSpellModifiers: [],
		incomingSpellModifiers: [
			{
				path: ['targetEffects', 'resources', 'health'],
				operation: 'multiply',
				amount: 2,
			},
		],
		intervalSpellTypeIds: [],
		timeoutSpellTypeIds: [],
		clearedSpellTypeIds: [],
		canStack: true,
	},
};
