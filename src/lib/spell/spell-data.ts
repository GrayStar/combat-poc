import {
	DISPEL_TYPE_ID,
	MODIFY_TYPE_ID,
	PERIODIC_EFFECT_TYPE_ID,
	RESOURCE_TYPE_ID,
	SCHOOL_TYPE_ID,
	SPELL_EFFECT_TYPE_ID,
	SpellModel,
} from '@/lib/spell/spell-models';
import { STAT_TYPE_ID } from '@/lib/character/character-models';

export enum SPELL_TYPE_ID {
	DD_AP = 'DD_AP',
	DH_SP = 'DH_SP',
	DOT = 'DOT',
	HOT = 'HOT',
	SP_UP = 'SP_UP',
	SP_DOWN = 'SP_DOWN',
	AP_UP = 'AP_UP',
	AP_DOWN = 'AP_DOWN',
	DISPEL_MAGIC = 'DISPEL_MAGIC',
}

export const spellData: Record<SPELL_TYPE_ID, SpellModel> = {
	[SPELL_TYPE_ID.DD_AP]: {
		spellTypeId: SPELL_TYPE_ID.DD_AP,
		title: 'DD-AP',
		description: 'Direct damage scaled with AP',
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
		schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
		damageEffects: [
			{
				spellEffectTypeId: SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE,
				schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
				value: 10,
				valueModifiers: [{ stat: STAT_TYPE_ID.ATTACK_POWER, coefficient: 0.1 }],
			},
		],
		healEffects: [],
		dispelEffects: [],
		auras: [],
	},
	[SPELL_TYPE_ID.DH_SP]: {
		spellTypeId: SPELL_TYPE_ID.DH_SP,
		title: 'DH-SP',
		description: 'Direct heal scaled with SP',
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
		schoolTypeId: SCHOOL_TYPE_ID.HOLY,
		healEffects: [
			{
				spellEffectTypeId: SPELL_EFFECT_TYPE_ID.HEAL,
				schoolTypeId: SCHOOL_TYPE_ID.HOLY,
				value: 10,
				valueModifiers: [{ stat: STAT_TYPE_ID.SPELL_POWER, coefficient: 0.1 }],
			},
		],
		damageEffects: [],
		dispelEffects: [],
		auras: [],
	},
	[SPELL_TYPE_ID.DISPEL_MAGIC]: {
		spellTypeId: SPELL_TYPE_ID.DISPEL_MAGIC,
		title: 'DS-MAG',
		description: 'Dispel 1 magic effect',
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
		schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
		dispelEffects: [
			{
				spellEffectTypeId: SPELL_EFFECT_TYPE_ID.DISPEL,
				dispelTypeId: DISPEL_TYPE_ID.MAGIC,
				value: 1,
			},
		],
		damageEffects: [],
		healEffects: [],
		auras: [],
	},
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
		damageEffects: [],
		healEffects: [],
		dispelEffects: [],
		auras: [
			{
				durationInMs: 8000,
				dispelTypeId: DISPEL_TYPE_ID.NONE,
				periodicEffects: [
					{
						periodicEffectTypeId: PERIODIC_EFFECT_TYPE_ID.DAMAGE,
						schoolTypeId: SCHOOL_TYPE_ID.FIRE,
						intervalInMs: 2000,
						value: 1,
						valueModifiers: [{ stat: STAT_TYPE_ID.SPELL_POWER, coefficient: 0.1 }],
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
		damageEffects: [],
		healEffects: [],
		dispelEffects: [],
		auras: [
			{
				durationInMs: 8000,
				dispelTypeId: DISPEL_TYPE_ID.NONE,
				periodicEffects: [
					{
						periodicEffectTypeId: PERIODIC_EFFECT_TYPE_ID.HEALING,
						schoolTypeId: SCHOOL_TYPE_ID.HOLY,
						intervalInMs: 2000,
						value: 1,
						valueModifiers: [{ stat: STAT_TYPE_ID.SPELL_POWER, coefficient: 0.14 }],
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
		damageEffects: [],
		healEffects: [],
		dispelEffects: [],
		auras: [
			{
				durationInMs: 8000,
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
		damageEffects: [],
		healEffects: [],
		dispelEffects: [],
		auras: [
			{
				durationInMs: 8000,
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
	[SPELL_TYPE_ID.AP_UP]: {
		spellTypeId: SPELL_TYPE_ID.AP_UP,
		title: 'AP+',
		description: 'increases AP',
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
		schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
		damageEffects: [],
		healEffects: [],
		dispelEffects: [],
		auras: [
			{
				durationInMs: 8000,
				dispelTypeId: DISPEL_TYPE_ID.MAGIC,
				periodicEffects: [],
				modifyStatEffects: [
					{
						modifyTypeId: MODIFY_TYPE_ID.INCREASE,
						statTypeId: STAT_TYPE_ID.ATTACK_POWER,
						value: 10,
					},
				],
			},
		],
	},
	[SPELL_TYPE_ID.AP_DOWN]: {
		spellTypeId: SPELL_TYPE_ID.AP_DOWN,
		title: 'AP-',
		description: 'Decreases AP',
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
		schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
		damageEffects: [],
		healEffects: [],
		dispelEffects: [],
		auras: [
			{
				durationInMs: 8000,
				dispelTypeId: DISPEL_TYPE_ID.MAGIC,
				periodicEffects: [],
				modifyStatEffects: [
					{
						modifyTypeId: MODIFY_TYPE_ID.DECREASE,
						statTypeId: STAT_TYPE_ID.ATTACK_POWER,
						value: 10,
					},
				],
			},
		],
	},
};
