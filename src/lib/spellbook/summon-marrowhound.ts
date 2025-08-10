import { SPELL_TYPE_ID } from '@/lib/spellbook/spell-type-id';
import { RESOURCE_TYPE_ID, SCHOOL_TYPE_ID } from '@/lib/spell/spell-models';
import { CHARACTER_TYPE_ID } from '@/lib/data/enums';

export const summonMarrowhoud = {
	spellTypeId: SPELL_TYPE_ID.SUMMON_MARROWHOUND,
	title: 'Summon Marrowhound',
	description: 'Summon a skeletal hound from the grave, loyal to the target',
	cost: [
		{
			resourceTypeId: RESOURCE_TYPE_ID.MANA,
			amountFlat: 80,
			amountPercent: 0,
		},
	],
	castTimeDurationInMs: 2500,
	cooldownDurationInMs: 0,
	globalCooldownDurationInMs: 1500,
	schoolTypeId: SCHOOL_TYPE_ID.SHADOW,
	hasCharges: false,
	maxCharges: 0,
	damageEffects: [],
	healEffects: [],
	dispelEffects: [],
	interruptEffects: [],
	summonEffects: [
		{
			value: 1,
			characterTypeId: CHARACTER_TYPE_ID.MARROWHOUND,
		},
	],
	resourceFillEffects: [],
	auras: [],
};
