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
		timeoutSpellTypeIds: [],
		clearedSpellTypeIds: [],
	},
};
