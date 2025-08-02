import { STAT_TYPE_ID } from '@/lib/character/character-models';
import { SPELL_TYPE_ID } from '@/lib/spell/spell-data';

export interface SpellModel {
	spellTypeId: SPELL_TYPE_ID;
	title: string;
	description: string;
	cost: SpellCost[];
	castTimeDurationInMs: number;
	cooldownDurationInMs: number;
	globalCooldownDurationInMs: number;
	spellEffects: SpellEffect[];
	auraDurationInMs: number;
	schoolTypeId: SCHOOL_TYPE_ID;
	dispelTypeId: DISPEL_TYPE_ID;
}

export interface SpellCost {
	resourceTypeId: RESOURCE_TYPE_ID;
	amountFlat: number;
	amountPercent: number;
}

export type SpellEffectApplyAura = {
	spellEffectTypeId: SPELL_EFFECT_TYPE_ID.APPLY_AURA;
	auraTypeId: AURA_TYPE_ID;
	auraCategoryTypeId: AURA_CATEGORY_TYPE_ID;
	value: number;
	valueModifiers: SpellEffectValueModifier[];
	intervalInMs: number;
};
export type SpellEffectDispel = {
	spellEffectTypeId: SPELL_EFFECT_TYPE_ID.DISPEL;
	dispelTypeId: DISPEL_TYPE_ID;
	value: number;
	valueModifiers: SpellEffectValueModifier[];
};
export type SpellEffectSchoolDamage = {
	spellEffectTypeId: SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE;
	schoolTypeId: SCHOOL_TYPE_ID;
	value: number;
	valueModifiers: SpellEffectValueModifier[];
};
export type SpellEffectHeal = {
	spellEffectTypeId: SPELL_EFFECT_TYPE_ID.HEAL;
	value: number;
	valueModifiers: SpellEffectValueModifier[];
};
export type SpellEffect = SpellEffectApplyAura | SpellEffectDispel | SpellEffectSchoolDamage | SpellEffectHeal;

export interface SpellEffectValueModifier {
	stat: STAT_TYPE_ID;
	coefficient: number;
}

export enum RESOURCE_TYPE_ID {
	HEALTH = 'HEALTH',
	MANA = 'MANA',
}

export enum SPELL_EFFECT_TYPE_ID {
	SCHOOL_DAMAGE = 'SCHOOL_DAMAGE',
	APPLY_AURA = 'APPLY_AURA',
	HEAL = 'HEAL',
	DISPEL = 'DISPEL',
}

export enum AURA_TYPE_ID {
	PERIODIC_DAMAGE = 'PERIODIC_DAMAGE',
	// PERIODIC_HEAL
	INCREASE_OUTGOING_DAMAGE_FLAT = 'INCREASE_OUTGOING_DAMAGE_FLAT',
	// INCREASE_OUTGOING_DAMAGE_PERCENT
	// INCREASE_OUTGOING_DAMAGE_MULTIPLIER
	DECREASE_OUTGOING_DAMAGE_FLAT = 'DECREASE_OUTGOING_DAMAGE_FLAT',
	// DECREASE_OUTGOING_DAMAGE_PERCENT
	// DECREASE_OUTGOING_DAMAGE_MULTIPLIER
	// INCREASE_INCOMING_DAMAGE_FLAT
	// INCREASE_INCOMING_DAMAGE_MULTIPLIER
	// INCREASE_INCOMING_DAMAGE_PERCENT
	// DECREASE_INCOMING_DAMAGE_FLAT
	// DECREASE_INCOMING_DAMAGE_MULTIPLIER
	// DECREASE_INCOMING_DAMAGE_PERCENT
	// EXPIRE_DAMAGE
	// EXPIRE_HEAL
}

export enum AURA_CATEGORY_TYPE_ID {
	HELPFUL = 'HELPFUL',
	HARMFUL = 'HARMFUL',
	PASSIVE = 'PASSIVE',
}

export enum SCHOOL_TYPE_ID {
	PHYSICAL = 'PHYSICAL',
	ARCANE = 'ARCANE',
	FIRE = 'FIRE',
	FROST = 'FROST',
	NATURE = 'NATURE',
	SHADOW = 'SHADOW',
	HOLY = 'HOLY',
}

export enum DISPEL_TYPE_ID {
	NONE = 'NONE',
	BLEED = 'BLEED',
	CURSE = 'CURSE',
	DISEASE = 'DISEASE',
	ENRAGE = 'ENRAGE',
	IMMUNITY = 'IMMUNITY',
	MAGIC = 'MAGIC',
	POISON = 'POISON',
	STEALTH = 'STEALTH',
}

export type SpellPayload = {
	casterId: string;
	title: string;
	auraDurationInMs: number;
	spellEffects: SpellEffect[];
};

export type AuraEffectConfig = {
	auraTypeId: AURA_TYPE_ID;
	auraCategoryTypeId: AURA_CATEGORY_TYPE_ID;
	value: number;
	intervalInMs: number;
};
