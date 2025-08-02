import {
	AURA_CATEGORY_TYPE_ID,
	AURA_TYPE_ID,
	DISPEL_TYPE_ID,
	RESOURCE_TYPE_ID,
	SCHOOL_TYPE_ID,
	SPELL_EFFECT_TYPE_ID,
	SpellEffect,
	SpellEffectApplyAura,
	SpellEffectSchoolDamage,
	SpellModel,
} from '@/lib/spell/spell-models';
import { STAT_TYPE_ID } from '../character/character-models';

export enum SPELL_TYPE_ID {
	FIREBALL = 'FIREBALL',
	PUNCH = 'PUNCH',
	DMG_BOOST = 'DMG_BOOST',
	DMG_REDUCTION = 'DMG_REDUCTION',
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
		castTimeDurationInMs: 1500,
		cooldownDurationInMs: 8000,
		globalCooldownDurationInMs: 1500,
		auraDurationInMs: 0,
		schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
		dispelTypeId: DISPEL_TYPE_ID.NONE,
		spellEffects: [
			{
				spellEffectTypeId: SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE,
				schoolTypeId: SCHOOL_TYPE_ID.PHYSICAL,
				value: 5,
				valueModifiers: [{ stat: STAT_TYPE_ID.ATTACK_POWER, coefficient: 0.1 }],
			},
		],
	},
	[SPELL_TYPE_ID.DMG_BOOST]: {
		spellTypeId: SPELL_TYPE_ID.DMG_BOOST,
		title: 'Dmg +10',
		description: 'Boost your damage.',
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
				auraTypeId: AURA_TYPE_ID.INCREASE_OUTGOING_DAMAGE_FLAT,
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
		description: 'Reduce targets damage.',
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
				auraTypeId: AURA_TYPE_ID.DECREASE_OUTGOING_DAMAGE_FLAT,
				auraCategoryTypeId: AURA_CATEGORY_TYPE_ID.HARMFUL,
				intervalInMs: 0,
				value: 10,
				valueModifiers: [],
			},
		],
	},
};

export const aruaTypeIdToSpellEffectTypeId: Record<
	AURA_TYPE_ID,
	{
		effectedSpellEffectTypeIds?: SPELL_EFFECT_TYPE_ID[];
		effectedAuraTypeIds?: AURA_TYPE_ID[];
		applyToValue?(baseValue: number, modValue: number): number;
	}
> = {
	// buffs/debuffs
	[AURA_TYPE_ID.INCREASE_OUTGOING_DAMAGE_FLAT]: {
		effectedSpellEffectTypeIds: [SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE],
		effectedAuraTypeIds: [AURA_TYPE_ID.PERIODIC_DAMAGE],
		applyToValue: (baseValue, modValue) => baseValue + modValue,
	},
	[AURA_TYPE_ID.DECREASE_OUTGOING_DAMAGE_FLAT]: {
		effectedSpellEffectTypeIds: [SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE],
		effectedAuraTypeIds: [AURA_TYPE_ID.PERIODIC_DAMAGE],
		applyToValue: (baseValue, modValue) => Math.max(0, baseValue - modValue),
	},

	// periodic
	[AURA_TYPE_ID.PERIODIC_DAMAGE]: {},
};

export function spellEffectIsApplyAura(spellEffect: SpellEffect): spellEffect is SpellEffectApplyAura {
	return spellEffect.spellEffectTypeId === SPELL_EFFECT_TYPE_ID.APPLY_AURA;
}

export function spellEffectIsSchoolDamage(spellEffect: SpellEffect): spellEffect is SpellEffectSchoolDamage {
	return spellEffect.spellEffectTypeId === SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE;
}
