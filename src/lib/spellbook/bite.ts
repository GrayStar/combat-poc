import { SCHOOL_TYPE_ID, SpellModel } from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spellbook/spell-type-id';
import { STAT_TYPE_ID } from '@/lib/character/character-models';

export const bite: SpellModel = {
	spellTypeId: SPELL_TYPE_ID.BITE,
	title: 'Bite',
	description: 'Sink jagged teeth into the target, dealing a vicious burst of damage.',
	cost: [],
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
			valueModifiers: [{ stat: STAT_TYPE_ID.STRENGTH, coefficient: 0.12 }],
		},
	],
	healEffects: [],
	dispelEffects: [],
	interruptEffects: [],
	summonEffects: [],
	resourceFillEffects: [],
	auras: [],
};
