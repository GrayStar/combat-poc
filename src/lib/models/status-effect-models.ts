import { SPELL_TYPE_ID, SpellInstance } from '@/lib/models';

export enum STATUS_EFFECT_TYPE_ID {
	BURN = 'BURN',
}

export interface StatusEffectModel {
	statusEffectTypeId: STATUS_EFFECT_TYPE_ID;
	title: string;
	description: string;
	duration: number;
	interval: number;
	outgoingSpellModifiers: StatusEffectModifier[];
	incomingSpellModifiers: StatusEffectModifier[];
	intervalSpellTypeIds: SPELL_TYPE_ID[];
	timeoutSpellTypeIds: SPELL_TYPE_ID[];
	clearedSpellTypeIds: SPELL_TYPE_ID[];
}

export interface StatusEffectModifier {
	property: keyof SpellInstance;
}

export interface StatusEffectInstance extends StatusEffectModel {
	statusEffectId: string;
}
