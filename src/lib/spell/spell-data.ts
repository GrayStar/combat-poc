import {
	DISPEL_TYPE_ID,
	MODIFY_TYPE_ID,
	PERIODIC_EFFECT_TYPE_ID,
	RESOURCE_TYPE_ID,
	SCHOOL_TYPE_ID,
	SpellModel,
} from '@/lib/spell/spell-models';
import { STAT_TYPE_ID } from '@/lib/character/character-models';

export enum SPELL_TYPE_ID {
	DOT = 'DOT',
	HOT = 'HOT',
	SP_UP = 'SP_UP',
	SP_DOWN = 'SP_DOWN',
}

export const spellData: Record<SPELL_TYPE_ID, SpellModel> = {
	[SPELL_TYPE_ID.DOT]: {
		spellTypeId: SPELL_TYPE_ID.DOT,
		title: 'DoT',
		description: 'Damage over time.',
		cost: [
			{
				resourceTypeId: RESOURCE_TYPE_ID.MANA,
				amountFlat: 30,
				amountPercent: 0,
			},
		],
		castTimeDurationInMs: 0,
		cooldownDurationInMs: 0,
		globalCooldownDurationInMs: 1500,
		schoolTypeId: SCHOOL_TYPE_ID.FIRE,
		spellEffects: [],
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
						valueModifiers: [{ stat: STAT_TYPE_ID.SPELL_POWER, coefficient: 0 }],
					},
				],
				modifyStatEffects: [],
			},
		],
	},
	[SPELL_TYPE_ID.HOT]: {
		spellTypeId: SPELL_TYPE_ID.HOT,
		title: 'HoT',
		description: 'Healing over time.',
		cost: [
			{
				resourceTypeId: RESOURCE_TYPE_ID.MANA,
				amountFlat: 30,
				amountPercent: 0,
			},
		],
		castTimeDurationInMs: 0,
		cooldownDurationInMs: 0,
		globalCooldownDurationInMs: 1500,
		schoolTypeId: SCHOOL_TYPE_ID.FIRE,
		spellEffects: [],
		auras: [
			{
				durationInMs: 4000,
				dispelTypeId: DISPEL_TYPE_ID.NONE,
				periodicEffects: [
					{
						periodicEffectTypeId: PERIODIC_EFFECT_TYPE_ID.HEALING,
						schoolTypeId: SCHOOL_TYPE_ID.HOLY,
						intervalInMs: 2000,
						value: 1,
						valueModifiers: [{ stat: STAT_TYPE_ID.SPELL_POWER, coefficient: 0 }],
					},
				],
				modifyStatEffects: [],
			},
		],
	},
	[SPELL_TYPE_ID.SP_UP]: {
		spellTypeId: SPELL_TYPE_ID.SP_UP,
		title: 'SP+',
		description: 'increases SP',
		cost: [
			{
				resourceTypeId: RESOURCE_TYPE_ID.MANA,
				amountFlat: 30,
				amountPercent: 0,
			},
		],
		castTimeDurationInMs: 0,
		cooldownDurationInMs: 0,
		globalCooldownDurationInMs: 1500,
		schoolTypeId: SCHOOL_TYPE_ID.FIRE,
		spellEffects: [],
		auras: [
			{
				durationInMs: 4000,
				dispelTypeId: DISPEL_TYPE_ID.MAGIC,
				periodicEffects: [],
				modifyStatEffects: [
					{
						modifyTypeId: MODIFY_TYPE_ID.INCREASE,
						statTypeId: STAT_TYPE_ID.SPELL_POWER,
						value: 10,
					},
				],
			},
		],
	},
	[SPELL_TYPE_ID.SP_DOWN]: {
		spellTypeId: SPELL_TYPE_ID.SP_DOWN,
		title: 'SP-',
		description: 'Decreases SP',
		cost: [
			{
				resourceTypeId: RESOURCE_TYPE_ID.MANA,
				amountFlat: 30,
				amountPercent: 0,
			},
		],
		castTimeDurationInMs: 0,
		cooldownDurationInMs: 0,
		globalCooldownDurationInMs: 1500,
		schoolTypeId: SCHOOL_TYPE_ID.FIRE,
		spellEffects: [],
		auras: [
			{
				durationInMs: 4000,
				dispelTypeId: DISPEL_TYPE_ID.MAGIC,
				periodicEffects: [],
				modifyStatEffects: [
					{
						modifyTypeId: MODIFY_TYPE_ID.DECREASE,
						statTypeId: STAT_TYPE_ID.SPELL_POWER,
						value: 10,
					},
				],
			},
		],
	},
};
