import { RESOURCE_TYPE_ID, SCHOOL_TYPE_ID } from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spellbook/spell-type-id';

export const manaPotion = {
	spellTypeId: SPELL_TYPE_ID.MANA_POTION,
	title: 'Mana Potion',
	description: 'Drink a mana potion, restoring a portion of mana.',
	cost: [],
	castTimeDurationInMs: 0,
	cooldownDurationInMs: 0,
	globalCooldownDurationInMs: 1500,
	schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
	hasCharges: true,
	maxCharges: 5,
	damageEffects: [],
	healEffects: [],
	dispelEffects: [],
	interruptEffects: [],
	summonEffects: [],
	resourceFillEffects: [
		{
			resourceTypeId: RESOURCE_TYPE_ID.MANA,
			value: 140,
		},
	],
	auras: [],
	isPotion: true,
};
