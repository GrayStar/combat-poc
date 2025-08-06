import { STAT_TYPE_ID } from '@/lib/character/character-models';
import { SPELL_TYPE_ID } from '@/lib/spell/spell-data';

export type SpellModel = {
	spellTypeId: SPELL_TYPE_ID;
	title: string;
	description: string;
	cost: SpellCost[];
	castTimeDurationInMs: number;
	cooldownDurationInMs: number;
	globalCooldownDurationInMs: number;
	schoolTypeId: SCHOOL_TYPE_ID;
	damageEffects: SpellEffectDamageModel[];
	healEffects: SpellEffectHealModel[];
	dispelEffects: SpellEffectDispelModel[];
	auras: AuraModel[];
};

export type SpellEffectDispelModel = {
	spellEffectTypeId: SPELL_EFFECT_TYPE_ID.DISPEL;
	dispelTypeId: DISPEL_TYPE_ID;
	value: number;
};

export type SpellEffectDamageModel = {
	spellEffectTypeId: SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE;
	schoolTypeId: SCHOOL_TYPE_ID;
	value: number;
	valueModifiers: SpellEffectValueModifier[];
};

export type SpellEffectHealModel = {
	spellEffectTypeId: SPELL_EFFECT_TYPE_ID.HEAL;
	schoolTypeId: SCHOOL_TYPE_ID;
	value: number;
	valueModifiers: SpellEffectValueModifier[];
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
	statTypeId: STAT_TYPE_ID;
	value: number;
};

export type SpellCost = {
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

export enum SPELL_EFFECT_TYPE_ID {
	APPLY_AURA = 'APPLY_AURA',
	DISPEL = 'DISPEL',
	HEAL = 'HEAL',
	SCHOOL_DAMAGE = 'SCHOOL_DAMAGE',
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
	casterId: string;
	title: string;
	spellTypeId: SPELL_TYPE_ID;
	schoolTypeId: SCHOOL_TYPE_ID;
	damageEffects: SpellEffectDamageModel[];
	healEffects: SpellEffectHealModel[];
	dispelEffects: SpellEffectDispelModel[];
	auras: AuraModel[];
};
