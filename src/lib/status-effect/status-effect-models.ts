import { SPELL_TYPE_ID, STATUS_EFFECT_TYPE_ID } from '@/lib/status-effect';

export interface StatusEffectModel {
	statusEffectTypeId: STATUS_EFFECT_TYPE_ID;
	title: string;
	description: string;
	durationInMs: number;
	intervalInMs: number;
	outgoingSpellModifiers: StatusEffectModifier[];
	incomingSpellModifiers: StatusEffectModifier[];
	intervalSpellTypeIds: SPELL_TYPE_ID[];
	timeoutSpellTypeIds: SPELL_TYPE_ID[];
	clearedSpellTypeIds: SPELL_TYPE_ID[];
	canStack: boolean;
}

export interface StatusEffectModifier {
	path: string[];
	operation: 'add' | 'subtract' | 'multiply' | 'divide';
	amount: number;
}
