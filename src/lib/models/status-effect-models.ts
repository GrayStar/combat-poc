import { SPELL_TYPE_ID, SpellInstance } from '@/lib/models';

export enum STATUS_EFFECT_IDS {
	BURN = 'BURN',
}

export interface StatusEffectModel {
	statusEffectId: STATUS_EFFECT_IDS;
	title: string;
	description: string;
	duration: number;
	interval: number;
	outgoingSpellModifiers: StatusEffectModifier[];
	incomingSpellModifiers: StatusEffectModifier[];
	intervalTickSpellIds: SPELL_TYPE_ID[];
	timeoutExpireSpellIds: SPELL_TYPE_ID[];
	timeoutClearedSpellIds: SPELL_TYPE_ID[];
}

export interface StatusEffectModifier {
	property: keyof SpellInstance;
}
