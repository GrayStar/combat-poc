import { STATUS_EFFECT_IDS } from './status-effect-models';

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
	statusEffectsToAdd?: STATUS_EFFECT_IDS[];
}

export interface SpellResource {
	health?: number;
	mana?: number;
}

export interface SpellInstance extends SpellModel {
	spellId: string;
}
