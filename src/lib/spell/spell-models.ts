import { ALL_STAT_TYPE_ID, STAT_TYPE_ID } from '@/lib/character/character-models';
import { CHARACTER_TYPE_ID } from '../data/enums';
import { SPELL_TYPE_ID } from '@/lib/spellbook/spell-type-id';

export type SpellModel = {
	//defaults
	spellTypeId: SPELL_TYPE_ID;
	title: string;
	description: string;
	cost: SpellCostModel[];
	castTimeDurationInMs: number;
	cooldownDurationInMs: number;
	globalCooldownDurationInMs: number;
	schoolTypeId: SCHOOL_TYPE_ID;
	hasCharges: boolean;
	maxCharges: number;
	//effects
	damageEffects: SpellEffectDamageModel[];
	healEffects: SpellEffectHealModel[];
	dispelEffects: SpellEffectDispelModel[];
	interruptEffects: SpellEffectInterruptModel[];
	summonEffects: SpellEffectSummonModel[];
	resourceFillEffects: SpellEffectResourceFillModel[];
	//auras
	auras: AuraModel[];
	// misc
	isPotion?: boolean;
};

export type SpellEffectDispelModel = {
	dispelTypeId: DISPEL_TYPE_ID;
	value: number;
};
export type SpellEffectDamageModel = {
	schoolTypeId: SCHOOL_TYPE_ID;
	value: number;
	valueModifiers: SpellEffectValueModifier[];
};
export type SpellEffectHealModel = {
	schoolTypeId: SCHOOL_TYPE_ID;
	value: number;
	valueModifiers: SpellEffectValueModifier[];
};
export type SpellEffectInterruptModel = {
	value: number;
};
export type SpellEffectSummonModel = {
	value: number;
	characterTypeId: CHARACTER_TYPE_ID;
};
export type SpellEffectResourceFillModel = {
	resourceTypeId: RESOURCE_TYPE_ID;
	value: number;
};

export type AuraModel = {
	durationInMs: number;
	dispelTypeId: DISPEL_TYPE_ID;
	periodicEffects: PeriodicEffectModel[];
	modifyStatEffects: ModifyStatEffectModel[];
};

export type PeriodicEffectModel = {
	periodicEffectTypeId: PERIODIC_EFFECT_TYPE_ID;
	schoolTypeId: SCHOOL_TYPE_ID;
	intervalInMs: number;
	value: number;
	valueModifiers: SpellEffectValueModifier[];
};

export type ModifyStatEffectModel = {
	modifyTypeId: MODIFY_TYPE_ID;
	statTypeId: ALL_STAT_TYPE_ID;
	value: number;
};

export type SpellCostModel = {
	resourceTypeId: RESOURCE_TYPE_ID;
	amountFlat: number;
	amountPercent: number;
};

export type SpellEffectValueModifier = {
	stat: STAT_TYPE_ID;
	coefficient: number;
};

export enum PERIODIC_EFFECT_TYPE_ID {
	DAMAGE = 'DAMAGE',
	HEALING = 'HEALING',
}

export enum MODIFY_TYPE_ID {
	INCREASE = 'INCREASE',
	DECREASE = 'DECREASE',
}

export enum RESOURCE_TYPE_ID {
	HEALTH = 'HEALTH',
	MANA = 'MANA',
}

export enum AURA_DIRECTION_TYPE_ID {
	NONE = 'NONE',
	INCOMING = 'INCOMING',
	OUTGOING = 'OUTGOING',
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
	spellId: string;
	casterId: string;
	title: string;
	spellTypeId: SPELL_TYPE_ID;
	schoolTypeId: SCHOOL_TYPE_ID;
	cost: SpellCostModel[];
	castTimeDurationInMs: number;
	damageEffects: SpellEffectDamageModel[];
	healEffects: SpellEffectHealModel[];
	dispelEffects: SpellEffectDispelModel[];
	interruptEffects: SpellEffectInterruptModel[];
	summonEffects: SpellEffectSummonModel[];
	resourceFillEffects: SpellEffectResourceFillModel[];
	auras: AuraModel[];
};
