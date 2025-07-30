import { SPELL_TYPE_ID, STATUS_EFFECT_TYPE_ID } from './status-effect-type-id';
import { StatusEffectModel } from './status-effect-models';

export const statusEffectData: Record<STATUS_EFFECT_TYPE_ID, StatusEffectModel> = {
	[STATUS_EFFECT_TYPE_ID.BURN]: {
		statusEffectTypeId: STATUS_EFFECT_TYPE_ID.BURN,
		title: 'Burn',
		description: 'Burn the target.',
		durationInMs: 4000,
		intervalInMs: 1000,
		outgoingSpellModifiers: [],
		incomingSpellModifiers: [],
		intervalSpellTypeIds: [SPELL_TYPE_ID.BURN_TICK],
		timeoutSpellTypeIds: [],
		clearedSpellTypeIds: [SPELL_TYPE_ID.SCAR],
		canStack: false,
	},
	[STATUS_EFFECT_TYPE_ID.SCARRED]: {
		statusEffectTypeId: STATUS_EFFECT_TYPE_ID.SCARRED,
		title: 'Scarred',
		description: 'Increases all damage taken.',
		durationInMs: 6000,
		intervalInMs: 0,
		outgoingSpellModifiers: [],
		incomingSpellModifiers: [],
		intervalSpellTypeIds: [],
		timeoutSpellTypeIds: [],
		clearedSpellTypeIds: [],
		canStack: true,
	},
	[STATUS_EFFECT_TYPE_ID.LIVING_BOMB]: {
		statusEffectTypeId: STATUS_EFFECT_TYPE_ID.LIVING_BOMB,
		title: 'Living Bomb',
		description: 'A bomb that explodes when timeout expires.',
		durationInMs: 6000,
		intervalInMs: 0,
		outgoingSpellModifiers: [],
		incomingSpellModifiers: [],
		intervalSpellTypeIds: [],
		timeoutSpellTypeIds: [SPELL_TYPE_ID.EXPLOSION],
		clearedSpellTypeIds: [],
		canStack: false,
	},
};
