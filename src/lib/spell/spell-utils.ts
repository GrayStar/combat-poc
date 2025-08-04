import {
	AURA_TYPE_ID,
	SPELL_EFFECT_TYPE_ID,
	SpellEffect,
	SpellEffectApplyAura,
	SpellEffectSchoolDamage,
} from '@/lib/spell/spell-models';

export const aruaTypeIdToSpellEffectTypeId: Record<
	AURA_TYPE_ID,
	{
		effectedSpellEffectTypeIds?: SPELL_EFFECT_TYPE_ID[];
		effectedAuraTypeIds?: AURA_TYPE_ID[];
		applyToValue?(base: number, modifier: number): number;
	}
> = {
	// modifiers
	[AURA_TYPE_ID.MODIFY_DAMAGE_FLAT]: {
		effectedSpellEffectTypeIds: [SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE],
		effectedAuraTypeIds: [AURA_TYPE_ID.PERIODIC_DAMAGE],
		applyToValue: (base, modifier) => base + modifier,
	},
	[AURA_TYPE_ID.MODIFY_DAMAGE_MULTIPLIER]: {
		effectedSpellEffectTypeIds: [SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE],
		effectedAuraTypeIds: [AURA_TYPE_ID.PERIODIC_DAMAGE],
		applyToValue: (base, modifier) => Math.floor(base * modifier),
	},
	[AURA_TYPE_ID.MOFIFY_DAMAGE_PERCENT]: {
		effectedSpellEffectTypeIds: [SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE],
		effectedAuraTypeIds: [AURA_TYPE_ID.PERIODIC_DAMAGE],
		applyToValue: (base, modifier) => base + Math.floor(base * modifier),
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
