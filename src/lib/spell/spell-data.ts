import {
	AURA_CATEGORY_TYPE_ID,
	AURA_TYPE_ID,
	DISPEL_TYPE_ID,
	RESOURCE_TYPE_ID,
	SCHOOL_TYPE_ID,
	SPELL_EFFECT_TYPE_ID,
	SpellModel,
} from '@/lib/spell/spell-models';
import { STAT_TYPE_ID } from '../character/character-models';

export enum SPELL_TYPE_ID {
	FIREBALL = 'FIREBALL',
	PUNCH = 'PUNCH',
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
				value: 14,
				valueModifiers: [{ stat: STAT_TYPE_ID.SPELL_POWER, coefficient: 0.12 }],
			},
			{
				spellEffectTypeId: SPELL_EFFECT_TYPE_ID.APPLY_AURA,
				auraTypeId: AURA_TYPE_ID.PERIODIC_DAMAGE,
				auraCategoryTypeId: AURA_CATEGORY_TYPE_ID.HARMFUL,
				value: 1,
				valueModifiers: [],
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
		auraDurationInMs: 4000,
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
};
