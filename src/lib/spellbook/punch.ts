import { SCHOOL_TYPE_ID, SpellModel } from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spellbook/spell-type-id';
import { STAT_TYPE_ID } from '@/lib/character/character-models';

export const punch: SpellModel = {
	spellTypeId: SPELL_TYPE_ID.PUNCH,
	title: 'Punch',
	description: 'A free jab with minimal impact. Costs nothing but your pride.',
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
			value: 8,
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
