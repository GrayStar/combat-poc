import {
	AURA_CATEGORY_TYPE_ID,
	AURA_TYPE_ID,
	DISPEL_TYPE_ID,
	RESOURCE_TYPE_ID,
	SCHOOL_TYPE_ID,
	SPELL_EFFECT_TYPE_ID,
	SpellModel,
} from '@/lib/spell/spell-models';
import { STAT_TYPE_ID } from '@/lib/character/character-models';

export enum SPELL_TYPE_ID {
	FIREBALL = 'FIREBALL',
	PUNCH = 'PUNCH',
	LESSER_HEAL = 'LESSER_HEAL',
	DMG_BOOST = 'DMG_BOOST',
	DMG_REDUCTION = 'DMG_REDUCTION',
	DMG_PERCENT_UP = 'DMG_PERCENT_UP',
	DMG_PERCENT_DOWN = 'DMG_PERCENT_DOWN',
	DMG_MULTIPLIED_UP = 'DMG_MULTIPLIED_UP',
	DMG_MULTIPLIED_DOWN = 'DMG_MULTIPLIED_DOWN',
}

export const spellData: Record<SPELL_TYPE_ID, SpellModel> = {
	[SPELL_TYPE_ID.FIREBALL]: {
		spellTypeId: SPELL_TYPE_ID.FIREBALL,
		title: 'Fireball',
		description: 'Hurls a fiery ball that causes %{} %{} damage and an additional ${} ${} damage over ${} sec.',
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
		auraDurationInMs: 4000,
		schoolTypeId: SCHOOL_TYPE_ID.FIRE,
		dispelTypeId: DISPEL_TYPE_ID.NONE,
		spellEffects: [
			{
				spellEffectTypeId: SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE,
				schoolTypeId: SCHOOL_TYPE_ID.FIRE,
				value: 10,
				valueModifiers: [{ stat: STAT_TYPE_ID.SPELL_POWER, coefficient: 0 }],
			},
			{
				spellEffectTypeId: SPELL_EFFECT_TYPE_ID.APPLY_AURA,
				auraTypeId: AURA_TYPE_ID.PERIODIC_DAMAGE,
				auraCategoryTypeId: AURA_CATEGORY_TYPE_ID.HARMFUL,
				value: 1,
				valueModifiers: [{ stat: STAT_TYPE_ID.SPELL_POWER, coefficient: 0 }],
				intervalInMs: 2000,
			},
		],
	},
	[SPELL_TYPE_ID.PUNCH]: {
		spellTypeId: SPELL_TYPE_ID.PUNCH,
		title: 'Punch',
		description: 'Punch the target.',
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
		auraDurationInMs: 0,
		schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
		dispelTypeId: DISPEL_TYPE_ID.NONE,
		spellEffects: [
			{
				spellEffectTypeId: SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE,
				schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
				value: 10,
				valueModifiers: [],
			},
		],
	},
	[SPELL_TYPE_ID.LESSER_HEAL]: {
		spellTypeId: SPELL_TYPE_ID.LESSER_HEAL,
		title: 'Lesser Heal',
		description: 'heal the target.',
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
		auraDurationInMs: 0,
		schoolTypeId: SCHOOL_TYPE_ID.HOLY,
		dispelTypeId: DISPEL_TYPE_ID.NONE,
		spellEffects: [
			{
				spellEffectTypeId: SPELL_EFFECT_TYPE_ID.HEAL,
				value: 10,
				valueModifiers: [],
			},
		],
	},
	[SPELL_TYPE_ID.DMG_BOOST]: {
		spellTypeId: SPELL_TYPE_ID.DMG_BOOST,
		title: 'Dmg +10',
		description: 'Increase outgoing damage by 10.',
		cost: [
			{
				resourceTypeId: RESOURCE_TYPE_ID.MANA,
				amountFlat: 10,
				amountPercent: 0,
			},
		],
		castTimeDurationInMs: 0,
		cooldownDurationInMs: 8000,
		globalCooldownDurationInMs: 1500,
		auraDurationInMs: 8000,
		schoolTypeId: SCHOOL_TYPE_ID.ARCANE,
		dispelTypeId: DISPEL_TYPE_ID.MAGIC,
		spellEffects: [
			{
				spellEffectTypeId: SPELL_EFFECT_TYPE_ID.APPLY_AURA,
				auraTypeId: AURA_TYPE_ID.MODIFY_OUTGOING_DAMAGE_FLAT,
				auraCategoryTypeId: AURA_CATEGORY_TYPE_ID.HELPFUL,
				intervalInMs: 0,
				value: 10,
				valueModifiers: [],
			},
		],
	},
	[SPELL_TYPE_ID.DMG_REDUCTION]: {
		spellTypeId: SPELL_TYPE_ID.DMG_REDUCTION,
		title: 'Dmg -10',
		description: 'Decrease outgoing damage by 10.',
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
		auraDurationInMs: 20000,
		schoolTypeId: SCHOOL_TYPE_ID.ARCANE,
		dispelTypeId: DISPEL_TYPE_ID.MAGIC,
		spellEffects: [
			{
				spellEffectTypeId: SPELL_EFFECT_TYPE_ID.APPLY_AURA,
				auraTypeId: AURA_TYPE_ID.MODIFY_OUTGOING_DAMAGE_FLAT,
				auraCategoryTypeId: AURA_CATEGORY_TYPE_ID.HARMFUL,
				intervalInMs: 0,
				value: -10,
				valueModifiers: [],
			},
		],
	},
	[SPELL_TYPE_ID.DMG_PERCENT_UP]: {
		spellTypeId: SPELL_TYPE_ID.DMG_PERCENT_UP,
		title: 'Dmg +10%',
		description: 'Increase outgoing damage by 10%.',
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
		auraDurationInMs: 20000,
		schoolTypeId: SCHOOL_TYPE_ID.ARCANE,
		dispelTypeId: DISPEL_TYPE_ID.MAGIC,
		spellEffects: [
			{
				spellEffectTypeId: SPELL_EFFECT_TYPE_ID.APPLY_AURA,
				auraTypeId: AURA_TYPE_ID.MOFIFY_OUTGOING_DAMAGE_PERCENT,
				auraCategoryTypeId: AURA_CATEGORY_TYPE_ID.HELPFUL,
				intervalInMs: 0,
				value: 0.1,
				valueModifiers: [],
			},
		],
	},
	[SPELL_TYPE_ID.DMG_PERCENT_DOWN]: {
		spellTypeId: SPELL_TYPE_ID.DMG_PERCENT_DOWN,
		title: 'Dmg -10%',
		description: 'Decrease outgoing damage by 10%.',
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
		auraDurationInMs: 20000,
		schoolTypeId: SCHOOL_TYPE_ID.ARCANE,
		dispelTypeId: DISPEL_TYPE_ID.MAGIC,
		spellEffects: [
			{
				spellEffectTypeId: SPELL_EFFECT_TYPE_ID.APPLY_AURA,
				auraTypeId: AURA_TYPE_ID.MOFIFY_OUTGOING_DAMAGE_PERCENT,
				auraCategoryTypeId: AURA_CATEGORY_TYPE_ID.HELPFUL,
				intervalInMs: 0,
				value: -0.1,
				valueModifiers: [],
			},
		],
	},
	[SPELL_TYPE_ID.DMG_MULTIPLIED_UP]: {
		spellTypeId: SPELL_TYPE_ID.DMG_MULTIPLIED_UP,
		title: 'Dmg *2',
		description: 'Double outgoing damage',
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
		auraDurationInMs: 20000,
		schoolTypeId: SCHOOL_TYPE_ID.ARCANE,
		dispelTypeId: DISPEL_TYPE_ID.MAGIC,
		spellEffects: [
			{
				spellEffectTypeId: SPELL_EFFECT_TYPE_ID.APPLY_AURA,
				auraTypeId: AURA_TYPE_ID.MODIFY_OUTGOING_DAMAGE_MULTIPLIER,
				auraCategoryTypeId: AURA_CATEGORY_TYPE_ID.HELPFUL,
				intervalInMs: 0,
				value: 2,
				valueModifiers: [],
			},
		],
	},
	[SPELL_TYPE_ID.DMG_MULTIPLIED_DOWN]: {
		spellTypeId: SPELL_TYPE_ID.DMG_MULTIPLIED_DOWN,
		title: 'Dmg *0.5',
		description: 'Halve outgoing damage',
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
		auraDurationInMs: 20000,
		schoolTypeId: SCHOOL_TYPE_ID.ARCANE,
		dispelTypeId: DISPEL_TYPE_ID.MAGIC,
		spellEffects: [
			{
				spellEffectTypeId: SPELL_EFFECT_TYPE_ID.APPLY_AURA,
				auraTypeId: AURA_TYPE_ID.MODIFY_OUTGOING_DAMAGE_MULTIPLIER,
				auraCategoryTypeId: AURA_CATEGORY_TYPE_ID.HELPFUL,
				intervalInMs: 0,
				value: 0.5,
				valueModifiers: [],
			},
		],
	},
};
