import {
	DISPEL_TYPE_ID,
	PERIODIC_EFFECT_TYPE_ID,
	RESOURCE_TYPE_ID,
	SCHOOL_TYPE_ID,
	SpellModel,
} from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spellbook/spell-type-id';
import { STAT_TYPE_ID } from '@/lib/character/character-models';

export const renew: SpellModel = {
	spellTypeId: SPELL_TYPE_ID.RENEW,
	title: 'Renew',
	description: 'Heal the target over time',
	cost: [
		{
			resourceTypeId: RESOURCE_TYPE_ID.MANA,
			amountFlat: 30,
			amountPercent: 0,
		},
	],
	castTimeDurationInMs: 0,
	cooldownDurationInMs: 0,
	globalCooldownDurationInMs: 1500,
	schoolTypeId: SCHOOL_TYPE_ID.HOLY,
	hasCharges: false,
	maxCharges: 0,
	damageEffects: [],
	healEffects: [],
	dispelEffects: [],
	interruptEffects: [],
	summonEffects: [],
	resourceFillEffects: [],
	auras: [
		{
			durationInMs: 15000,
			dispelTypeId: DISPEL_TYPE_ID.MAGIC,
			periodicEffects: [
				{
					periodicEffectTypeId: PERIODIC_EFFECT_TYPE_ID.HEALING,
					schoolTypeId: SCHOOL_TYPE_ID.HOLY,
					intervalInMs: 3000,
					value: 9,
					valueModifiers: [
						{
							stat: STAT_TYPE_ID.INTELLIGENCE,
							coefficient: 0.11,
						},
					],
				},
			],
			modifyStatEffects: [],
		},
	],
};
