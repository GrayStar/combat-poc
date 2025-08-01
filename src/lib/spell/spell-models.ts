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

export const spellEffectIsApplyAura = (spellEffect: SpellEffect): spellEffect is SpellEffectApplyAura =>
	Object.prototype.hasOwnProperty.call(spellEffect, SPELL_EFFECT_TYPE_ID.APPLY_AURA);
export const spellEffectIsSchoolDamage = (spellEffect: SpellEffect): spellEffect is SpellEffectSchoolDamage =>
	Object.prototype.hasOwnProperty.call(spellEffect, SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE);
export const spellEffectIsDispell = (spellEffect: SpellEffect): spellEffect is SpellEffectDispel =>
	Object.prototype.hasOwnProperty.call(spellEffect, SPELL_EFFECT_TYPE_ID.DISPEL);
export const spellEffectIsHeal = (spellEffect: SpellEffect): spellEffect is SpellEffectHeal =>
	Object.prototype.hasOwnProperty.call(spellEffect, SPELL_EFFECT_TYPE_ID.HEAL);

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
	PERIODIC_HEAL = 'PERIODIC_HEAL',
	PERIODIC_DAMAGE = 'PERIODIC_DAMAGE',
	MOD_DAMAGE_DONE_PERCENT = 'MOD_DAMAGE_DONE_PERCENT',
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
	spellEffects: SpellPayloadSpellEffect[];
};

export type SpellPayloadSpellEffect = Omit<SpellEffect, 'valueModifiers'>;
