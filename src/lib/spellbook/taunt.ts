import { SCHOOL_TYPE_ID, SpellModel } from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spellbook/spell-type-id';

export const taunt: SpellModel = {
	spellTypeId: SPELL_TYPE_ID.TAUNT,
	title: 'taunt',
	description: 'Taunt the target, tempting it to attack you.',
	cost: [],
	castTimeDurationInMs: 0,
	cooldownDurationInMs: 0,
	globalCooldownDurationInMs: 1500,
	schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
	hasCharges: false,
	maxCharges: 0,
	damageEffects: [],
	healEffects: [],
	dispelEffects: [],
	interruptEffects: [],
	summonEffects: [],
	resourceFillEffects: [],
	tauntEffects: [
		{
			value: 25,
		},
	],
	auras: [],
};
