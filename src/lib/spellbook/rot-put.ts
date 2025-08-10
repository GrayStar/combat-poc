import { DISPEL_TYPE_ID, PERIODIC_EFFECT_TYPE_ID, SCHOOL_TYPE_ID, SpellModel } from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spellbook/spell-type-id';
import { STAT_TYPE_ID } from '@/lib/character/character-models';

export const rotPut: SpellModel = {
	spellTypeId: SPELL_TYPE_ID.ROT_PUT,
	title: 'Rot Put',
	description: 'Hurl a rotting bone mass, dealing instant damage and inflicting a brief flesh-eating disease.',
	cost: [],
	castTimeDurationInMs: 0,
	cooldownDurationInMs: 0,
	globalCooldownDurationInMs: 1500,
	schoolTypeId: SCHOOL_TYPE_ID.SHADOW,
	hasCharges: false,
	maxCharges: 0,
	damageEffects: [
		{
			schoolTypeId: SCHOOL_TYPE_ID.SHADOW,
			value: 14,
			valueModifiers: [
				{
					stat: STAT_TYPE_ID.INTELLIGENCE,
					coefficient: 0.12,
				},
			],
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
			dispelTypeId: DISPEL_TYPE_ID.DISEASE,
			periodicEffects: [
				{
					periodicEffectTypeId: PERIODIC_EFFECT_TYPE_ID.DAMAGE,
					schoolTypeId: SCHOOL_TYPE_ID.SHADOW,
					intervalInMs: 2000,
					value: 1,
					valueModifiers: [
						{
							stat: STAT_TYPE_ID.INTELLIGENCE,
							coefficient: 0,
						},
					],
				},
			],
			modifyStatEffects: [],
		},
	],
};
