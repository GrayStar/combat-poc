import {
	DISPEL_TYPE_ID,
	PERIODIC_EFFECT_TYPE_ID,
	RESOURCE_TYPE_ID,
	SCHOOL_TYPE_ID,
	SpellModel,
} from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spellbook/spell-type-id';
import { STAT_TYPE_ID } from '@/lib/character/character-models';

export const rend: SpellModel = {
	spellTypeId: SPELL_TYPE_ID.REND,
	title: 'Rend',
	description: 'Tear into the target with vicious claws, leaving a bleeding wound that lingers briefly.',
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
	schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
	hasCharges: false,
	maxCharges: 0,
	damageEffects: [
		{
			schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
			value: 14,
			valueModifiers: [{ stat: STAT_TYPE_ID.DEXTERITY, coefficient: 0.12 }],
		},
	],
	healEffects: [],
	dispelEffects: [],
	interruptEffects: [],
	summonEffects: [],
	resourceFillEffects: [],
	auras: [
		{
			durationInMs: 8000,
			dispelTypeId: DISPEL_TYPE_ID.BLEED,
			periodicEffects: [
				{
					periodicEffectTypeId: PERIODIC_EFFECT_TYPE_ID.DAMAGE,
					schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
					intervalInMs: 2000,
					value: 1,
					valueModifiers: [],
				},
			],
			modifyStatEffects: [],
		},
	],
};
