import {
	AURA_TYPE_ID,
	SPELL_EFFECT_TYPE_ID,
	SpellEffect,
	SpellEffectApplyAura,
	SpellEffectDispel,
	SpellEffectHeal,
	SpellEffectSchoolDamage,
} from '@/lib/spell/spell-models';

export const applicableAuraTypeIdsBySpellEffectTypeId: Record<SPELL_EFFECT_TYPE_ID, AURA_TYPE_ID[]> = {
	[SPELL_EFFECT_TYPE_ID.APPLY_AURA]: [],
	[SPELL_EFFECT_TYPE_ID.DISPEL]: [],
	[SPELL_EFFECT_TYPE_ID.HEAL]: [
		AURA_TYPE_ID.MODIFY_HEALING_FLAT,
		AURA_TYPE_ID.MODIFY_HEALING_MULTIPLIER,
		AURA_TYPE_ID.MODIFY_HEALING_PERCENT,
	],
	[SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE]: [
		AURA_TYPE_ID.MODIFY_DAMAGE_FLAT,
		AURA_TYPE_ID.MODIFY_DAMAGE_MULTIPLIER,
		AURA_TYPE_ID.MODIFY_DAMAGE_PERCENT,
	],
};

export const applicableAuraTypeIdsByAuraTypeId: Record<AURA_TYPE_ID, AURA_TYPE_ID[]> = {
	[AURA_TYPE_ID.MODIFY_DAMAGE_FLAT]: [],
	[AURA_TYPE_ID.MODIFY_DAMAGE_MULTIPLIER]: [],
	[AURA_TYPE_ID.MODIFY_DAMAGE_PERCENT]: [],
	[AURA_TYPE_ID.MODIFY_HEALING_FLAT]: [],
	[AURA_TYPE_ID.MODIFY_HEALING_MULTIPLIER]: [],
	[AURA_TYPE_ID.MODIFY_HEALING_PERCENT]: [],
	[AURA_TYPE_ID.PERIODIC_DAMAGE]: [
		AURA_TYPE_ID.MODIFY_DAMAGE_FLAT,
		AURA_TYPE_ID.MODIFY_DAMAGE_MULTIPLIER,
		AURA_TYPE_ID.MODIFY_DAMAGE_PERCENT,
	],
	[AURA_TYPE_ID.PERIODIC_HEAL]: [
		AURA_TYPE_ID.MODIFY_HEALING_FLAT,
		AURA_TYPE_ID.MODIFY_HEALING_MULTIPLIER,
		AURA_TYPE_ID.MODIFY_HEALING_PERCENT,
	],
};

export const auraModifierEquationByAuraTypeId: Record<AURA_TYPE_ID, (base: number, modifier: number) => number> = {
	[AURA_TYPE_ID.MODIFY_DAMAGE_FLAT]: (base, modifier) => base + modifier,
	[AURA_TYPE_ID.MODIFY_DAMAGE_MULTIPLIER]: (base, modifier) => Math.floor(base * modifier),
	[AURA_TYPE_ID.MODIFY_DAMAGE_PERCENT]: (base, modifier) => base + Math.floor(base * modifier),
	[AURA_TYPE_ID.MODIFY_HEALING_FLAT]: (base, modifier) => base + modifier,
	[AURA_TYPE_ID.MODIFY_HEALING_MULTIPLIER]: (base, modifier) => Math.floor(base * modifier),
	[AURA_TYPE_ID.MODIFY_HEALING_PERCENT]: (base, modifier) => base + Math.floor(base * modifier),
	[AURA_TYPE_ID.PERIODIC_DAMAGE]: (base) => base,
	[AURA_TYPE_ID.PERIODIC_HEAL]: (base) => base,
};

export function spellEffectIsApplyAura(spellEffect: SpellEffect): spellEffect is SpellEffectApplyAura {
	return spellEffect.spellEffectTypeId === SPELL_EFFECT_TYPE_ID.APPLY_AURA;
}

export function spellEffectIsSchoolDamage(spellEffect: SpellEffect): spellEffect is SpellEffectSchoolDamage {
	return spellEffect.spellEffectTypeId === SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE;
}

export function spellEffectIsDispel(spellEffect: SpellEffect): spellEffect is SpellEffectDispel {
	return spellEffect.spellEffectTypeId === SPELL_EFFECT_TYPE_ID.DISPEL;
}

export function spellEffectIsHeal(spellEffect: SpellEffect): spellEffect is SpellEffectHeal {
	return spellEffect.spellEffectTypeId === SPELL_EFFECT_TYPE_ID.HEAL;
}
