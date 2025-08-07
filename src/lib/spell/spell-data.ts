import {
	DISPEL_TYPE_ID,
	MODIFY_TYPE_ID,
	PERIODIC_EFFECT_TYPE_ID,
	RESOURCE_TYPE_ID,
	SCHOOL_TYPE_ID,
	SpellModel,
} from '@/lib/spell/spell-models';
import { SECONDARY_STAT_TYPE_ID, STAT_TYPE_ID } from '@/lib/character/character-models';
import { CHARACTER_TYPE_ID } from '../data/enums';

export enum SPELL_TYPE_ID {
	DD_AP = 'DD_AP',
	DH_SP = 'DH_SP',
	DOT = 'DOT',
	HOT = 'HOT',
	DISPEL_MAGIC = 'DISPEL_MAGIC',
	VIT_UP = 'VIT_UP',
	HASTE_UP = 'HASTE_UP',
	INTERRUPT = 'INTERRUPT',
	SUMMON_SKELETON = 'SUMMON_SKELETON',
}

export const spellData: Record<SPELL_TYPE_ID, SpellModel> = {
	[SPELL_TYPE_ID.DD_AP]: {
		spellTypeId: SPELL_TYPE_ID.DD_AP,
		title: 'DD-AP',
		description: 'Direct damage scaled with AP',
		cost: [
			{
				resourceTypeId: RESOURCE_TYPE_ID.MANA,
				amountFlat: 10,
				amountPercent: 0,
			},
		],
		castTimeDurationInMs: 0,
		cooldownDurationInMs: 0,
		globalCooldownDurationInMs: 1500,
		schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
		damageEffects: [
			{
				schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
				value: 20,
				valueModifiers: [{ stat: STAT_TYPE_ID.STRENGTH, coefficient: 0.15 }],
			},
		],
		healEffects: [],
		dispelEffects: [],
		interruptEffects: [],
		summonEffects: [],
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
				schoolTypeId: SCHOOL_TYPE_ID.HOLY,
				value: 10,
				valueModifiers: [{ stat: STAT_TYPE_ID.INTELLIGENCE, coefficient: 0.1 }],
			},
		],
		damageEffects: [],
		dispelEffects: [],
		interruptEffects: [],
		summonEffects: [],
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
				dispelTypeId: DISPEL_TYPE_ID.MAGIC,
				value: 1,
			},
		],
		damageEffects: [],
		healEffects: [],
		interruptEffects: [],
		summonEffects: [],
		auras: [],
	},
	[SPELL_TYPE_ID.DOT]: {
		spellTypeId: SPELL_TYPE_ID.DOT,
		title: 'DoT',
		description: 'Hurls a ball of fire that causes a burst of damage in addition to a lingering burn.',
		cost: [
			{
				resourceTypeId: RESOURCE_TYPE_ID.MANA,
				amountFlat: 30,
				amountPercent: 0,
			},
		],
		castTimeDurationInMs: 1500,
		cooldownDurationInMs: 0,
		globalCooldownDurationInMs: 1500,
		schoolTypeId: SCHOOL_TYPE_ID.FIRE,
		damageEffects: [
			{
				schoolTypeId: SCHOOL_TYPE_ID.FIRE,
				value: 10,
				valueModifiers: [{ stat: STAT_TYPE_ID.INTELLIGENCE, coefficient: 0.14 }],
			},
		],
		healEffects: [],
		dispelEffects: [],
		interruptEffects: [],
		summonEffects: [],
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
						valueModifiers: [{ stat: STAT_TYPE_ID.INTELLIGENCE, coefficient: 0.1 }],
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
		interruptEffects: [],
		summonEffects: [],
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
						valueModifiers: [{ stat: STAT_TYPE_ID.INTELLIGENCE, coefficient: 0.14 }],
					},
				],
				modifyStatEffects: [],
			},
		],
	},
	[SPELL_TYPE_ID.VIT_UP]: {
		spellTypeId: SPELL_TYPE_ID.VIT_UP,
		title: 'VIT+',
		description: 'Increases vitality.',
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
		schoolTypeId: SCHOOL_TYPE_ID.ARCANE,
		damageEffects: [],
		healEffects: [],
		dispelEffects: [],
		interruptEffects: [],
		summonEffects: [],
		auras: [
			{
				durationInMs: 8000,
				dispelTypeId: DISPEL_TYPE_ID.MAGIC,
				periodicEffects: [],
				modifyStatEffects: [
					{
						modifyTypeId: MODIFY_TYPE_ID.INCREASE,
						statTypeId: STAT_TYPE_ID.VITALITY,
						value: 2,
					},
				],
			},
		],
	},
	[SPELL_TYPE_ID.HASTE_UP]: {
		spellTypeId: SPELL_TYPE_ID.HASTE_UP,
		title: 'H+',
		description: 'Increases haste.',
		cost: [
			{
				resourceTypeId: RESOURCE_TYPE_ID.MANA,
				amountFlat: 10,
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
		interruptEffects: [],
		summonEffects: [],
		auras: [
			{
				durationInMs: 8000,
				dispelTypeId: DISPEL_TYPE_ID.MAGIC,
				periodicEffects: [],
				modifyStatEffects: [
					{
						modifyTypeId: MODIFY_TYPE_ID.INCREASE,
						statTypeId: SECONDARY_STAT_TYPE_ID.HASTE,
						value: 0.63,
					},
				],
			},
		],
	},
	[SPELL_TYPE_ID.INTERRUPT]: {
		spellTypeId: SPELL_TYPE_ID.INTERRUPT,
		title: 'Interrupt',
		description: 'Interrupts spell casting.',
		cost: [
			{
				resourceTypeId: RESOURCE_TYPE_ID.MANA,
				amountFlat: 10,
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
		interruptEffects: [{ value: 1 }],
		summonEffects: [],
		auras: [],
	},
	[SPELL_TYPE_ID.SUMMON_SKELETON]: {
		spellTypeId: SPELL_TYPE_ID.SUMMON_SKELETON,
		title: 'Summon Skeleton',
		description: 'Summons a small army of skeletons.',
		cost: [
			{
				resourceTypeId: RESOURCE_TYPE_ID.MANA,
				amountFlat: 80,
				amountPercent: 0,
			},
		],
		castTimeDurationInMs: 8000,
		cooldownDurationInMs: 20000,
		globalCooldownDurationInMs: 1500,
		schoolTypeId: SCHOOL_TYPE_ID.SHADOW,
		damageEffects: [],
		healEffects: [],
		dispelEffects: [],
		interruptEffects: [],
		summonEffects: [
			{
				value: 3,
				characterTypeId: CHARACTER_TYPE_ID.SKELETON,
			},
		],
		auras: [],
	},
};
