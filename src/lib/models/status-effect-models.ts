import { SPELL_TYPE_ID } from '@/lib/spell';

export enum STATUS_EFFECT_TYPE_ID {
	BURN = 'BURN',
	SCARRED = 'SCARRED',
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
	canStack: boolean;
}

export interface StatusEffectModifier {
	path: string[];
	operation: 'add' | 'subtract' | 'multiply' | 'divide';
	amount: number;
}

export interface StatusEffectInstance extends StatusEffectModel {
	statusEffectId: string;
	stacks?: number;
}
