import { SECONDARY_STAT_TYPE_ID, STAT_TYPE_ID } from '@/lib/character/character-models';
import { DISPEL_TYPE_ID, MODIFY_TYPE_ID, RESOURCE_TYPE_ID, SCHOOL_TYPE_ID, SpellModel } from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spellbook/spell-type-id';
import { rotPut } from './rot-put';
import { punch } from './punch';
import { heal } from './heal';
import { dispelMagic } from './dispel-magic';
import { fireball } from './fireball';
import { renew } from './renew';
import { healthPotion } from './health-potion';
import { manaPotion } from './mana-potion';
import { summonMarrowhoud } from './summon-marrowhound';
import { rend } from './rend';
import { bite } from './bite';

export const spellData: Record<SPELL_TYPE_ID, SpellModel> = {
	[SPELL_TYPE_ID.ROT_PUT]: rotPut,
	[SPELL_TYPE_ID.PUNCH]: punch,
	[SPELL_TYPE_ID.HEAL]: heal,
	[SPELL_TYPE_ID.DISPEL_MAGIC]: dispelMagic,
	[SPELL_TYPE_ID.FIREBALL]: fireball,
	[SPELL_TYPE_ID.RENEW]: renew,
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
		hasCharges: false,
		maxCharges: 0,
		damageEffects: [],
		healEffects: [],
		dispelEffects: [],
		interruptEffects: [],
		summonEffects: [],
		resourceFillEffects: [],
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
		hasCharges: false,
		maxCharges: 0,
		damageEffects: [],
		healEffects: [],
		dispelEffects: [],
		interruptEffects: [],
		summonEffects: [],
		resourceFillEffects: [],
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
		hasCharges: false,
		maxCharges: 0,
		damageEffects: [],
		healEffects: [],
		dispelEffects: [],
		interruptEffects: [{ value: 1 }],
		summonEffects: [],
		resourceFillEffects: [],
		auras: [],
	},
	[SPELL_TYPE_ID.SUMMON_MARROWHOUND]: summonMarrowhoud,
	[SPELL_TYPE_ID.BITE]: bite,
	[SPELL_TYPE_ID.REND]: rend,
	[SPELL_TYPE_ID.HEALTH_POTION]: healthPotion,
	[SPELL_TYPE_ID.MANA_POTION]: manaPotion,
};
