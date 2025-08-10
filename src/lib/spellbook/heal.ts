import { RESOURCE_TYPE_ID, SCHOOL_TYPE_ID, SpellModel } from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spellbook/spell-type-id';
import { STAT_TYPE_ID } from '@/lib/character/character-models';

export const heal: SpellModel = {
	spellTypeId: SPELL_TYPE_ID.HEAL,
	title: 'Heal',
	description: 'Direct heal scaled with SP',
	cost: [
		{
			resourceTypeId: RESOURCE_TYPE_ID.MANA,
			amountFlat: 75,
			amountPercent: 0,
		},
	],
	castTimeDurationInMs: 2500,
	cooldownDurationInMs: 0,
	globalCooldownDurationInMs: 1500,
	schoolTypeId: SCHOOL_TYPE_ID.HOLY,
	hasCharges: false,
	maxCharges: 0,
	healEffects: [
		{
			schoolTypeId: SCHOOL_TYPE_ID.HOLY,
			value: 135,
			valueModifiers: [{ stat: STAT_TYPE_ID.INTELLIGENCE, coefficient: 0.44 }],
		},
	],
	damageEffects: [],
	dispelEffects: [],
	interruptEffects: [],
	summonEffects: [],
	resourceFillEffects: [],
	auras: [],
};
