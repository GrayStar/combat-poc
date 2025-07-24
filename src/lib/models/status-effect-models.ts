import { SPELL_IDS } from '@/lib/models';
import { SpellInstance } from '../instances';

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
	intervalTickSpellIds: SPELL_IDS[];
	timeoutExpireSpellIds: SPELL_IDS[];
	timeoutClearedSpellIds: SPELL_IDS[];
}

export interface StatusEffectModifier {
	property: keyof SpellInstance;
}
