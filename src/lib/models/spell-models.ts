import { STATUS_EFFECT_TYPE_ID } from './status-effect-models';

export enum SPELL_TYPE_ID {
	PUNCH = 'PUNCH',
	FIREBALL = 'FIREBALL',
	BURN_TICK = 'BURN_TICK',
	SCAR = 'SCAR',
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
}

export interface SpellEffect {
	resources?: SpellResource;
	statusEffectTypeIdsToAdd?: STATUS_EFFECT_TYPE_ID[];
	statusEffectTypeIdsToRemove?: STATUS_EFFECT_TYPE_ID[];
}

export interface SpellResource {
	health?: number;
	mana?: number;
}

export interface SpellInstance extends SpellModel {
	spellId: string;
}
