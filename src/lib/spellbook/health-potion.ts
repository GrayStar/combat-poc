import { RESOURCE_TYPE_ID, SCHOOL_TYPE_ID } from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spellbook/spell-type-id';

export const healthPotion = {
	spellTypeId: SPELL_TYPE_ID.HEALTH_POTION,
	title: 'Health Potion',
	description: 'Drink a health potion, restoring a portion of health.',
	cost: [],
	castTimeDurationInMs: 0,
	cooldownDurationInMs: 60000,
	globalCooldownDurationInMs: 0,
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
			resourceTypeId: RESOURCE_TYPE_ID.HEALTH,
			value: 140,
		},
	],
	auras: [],
	isPotion: true,
};
