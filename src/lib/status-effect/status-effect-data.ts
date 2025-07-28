import { StatusEffectModel } from '@/lib/status-effect';

export enum STATUS_EFFECT_TYPE_ID {
	BURN = 'BURN',
	SCARRED = 'SCARRED',
}

export const statusEffectData: Record<STATUS_EFFECT_TYPE_ID, StatusEffectModel> = {
	[STATUS_EFFECT_TYPE_ID.BURN]: {
		statusEffectTypeId: STATUS_EFFECT_TYPE_ID.BURN,
		title: 'Burn',
		description: 'Burn the target.',
		duration: 4000,
		interval: 1000,
		outgoingSpellModifiers: [],
		incomingSpellModifiers: [],
		intervalSpellTypeIds: [],
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
		incomingSpellModifiers: [],
		intervalSpellTypeIds: [],
		timeoutSpellTypeIds: [],
		clearedSpellTypeIds: [],
		canStack: true,
	},
};
