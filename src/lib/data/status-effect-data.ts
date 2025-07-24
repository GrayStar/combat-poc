import { SPELL_IDS, STATUS_EFFECT_IDS, StatusEffectModel } from '../models';

export const statusEffectData: Record<STATUS_EFFECT_IDS, StatusEffectModel> = {
	[STATUS_EFFECT_IDS.BURN]: {
		statusEffectId: STATUS_EFFECT_IDS.BURN,
		title: 'Burn',
		description: 'Burn the target.',
		duration: 5000,
		interval: 500,
		outgoingSpellModifiers: [],
		incomingSpellModifiers: [],
		intervalTickSpellIds: [SPELL_IDS.BURN_TICK],
		timeoutExpireSpellIds: [],
		timeoutClearedSpellIds: [],
	},
};
