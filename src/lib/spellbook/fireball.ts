import {
	DISPEL_TYPE_ID,
	PERIODIC_EFFECT_TYPE_ID,
	RESOURCE_TYPE_ID,
	SCHOOL_TYPE_ID,
	SpellModel,
} from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spellbook/spell-type-id';
import { STAT_TYPE_ID } from '@/lib/character/character-models';

export const fireball: SpellModel = {
	spellTypeId: SPELL_TYPE_ID.FIREBALL,
	title: 'Fireball',
	description: 'Hurls a ball of fire that causes a burst of damage in addition to a lingering burn.',
	cost: [
		{
			resourceTypeId: RESOURCE_TYPE_ID.MANA,
			amountFlat: 30,
			amountPercent: 0,
		},
	],
	castTimeDurationInMs: 1500,
	cooldownDurationInMs: 0,
	globalCooldownDurationInMs: 1500,
	schoolTypeId: SCHOOL_TYPE_ID.FIRE,
	hasCharges: false,
	maxCharges: 0,
	damageEffects: [
		{
			schoolTypeId: SCHOOL_TYPE_ID.FIRE,
			value: 10,
			valueModifiers: [{ stat: STAT_TYPE_ID.INTELLIGENCE, coefficient: 0.14 }],
		},
	],
	healEffects: [],
	dispelEffects: [],
	interruptEffects: [],
	summonEffects: [],
	resourceFillEffects: [],
	auras: [
		{
			durationInMs: 4000,
			dispelTypeId: DISPEL_TYPE_ID.NONE,
			periodicEffects: [
				{
					periodicEffectTypeId: PERIODIC_EFFECT_TYPE_ID.DAMAGE,
					schoolTypeId: SCHOOL_TYPE_ID.FIRE,
					intervalInMs: 2000,
					value: 1,
					valueModifiers: [{ stat: STAT_TYPE_ID.INTELLIGENCE, coefficient: 0 }],
				},
			],
			modifyStatEffects: [],
		},
	],
};
