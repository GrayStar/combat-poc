import { STATUS_EFFECT_TYPE_ID } from './status-effect-models';

export enum SPELL_TYPE_ID {
	FIREBALL = 'FIREBALL',
	BURN_TICK = 'BURN_TICK',
	HEAL = 'HEAL',
	LIFE_TAP = 'LIFE_TAP',
}

export interface SpellModel {
	spellTypeId: SPELL_TYPE_ID;
	title: string;
	description: string;
	castTimeDurationInMs?: number;
	casterEffects?: SpellEffect;
	targetEffects?: SpellEffect;
	isStatusEffectDependeny?: boolean;
}

export interface SpellEffect {
	resources?: SpellResource;
	statusEffectsTypeIdsToAdd?: STATUS_EFFECT_TYPE_ID[];
	statusEffectsTypeIdsToRemove?: STATUS_EFFECT_TYPE_ID[];
}

export interface SpellResource {
	health?: number;
	mana?: number;
}

export interface SpellInstance extends SpellModel {
	spellId: string;
}
