import { DISPEL_TYPE_ID, RESOURCE_TYPE_ID, SCHOOL_TYPE_ID, SpellModel } from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spellbook/spell-type-id';

export const dispelMagic: SpellModel = {
	spellTypeId: SPELL_TYPE_ID.DISPEL_MAGIC,
	title: 'Dispel Magic',
	description: 'Dispel 1 magic effect',
	cost: [
		{
			resourceTypeId: RESOURCE_TYPE_ID.MANA,
			amountFlat: 18,
			amountPercent: 0,
		},
	],
	castTimeDurationInMs: 0,
	cooldownDurationInMs: 0,
	globalCooldownDurationInMs: 1500,
	schoolTypeId: SCHOOL_TYPE_ID.HOLY,
	hasCharges: false,
	maxCharges: 0,
	dispelEffects: [
		{
			dispelTypeId: DISPEL_TYPE_ID.MAGIC,
			value: 1,
		},
	],
	damageEffects: [],
	healEffects: [],
	interruptEffects: [],
	summonEffects: [],
	resourceFillEffects: [],
	auras: [],
};
