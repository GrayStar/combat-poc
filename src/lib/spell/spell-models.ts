import { STATUS_EFFECT_TYPE_ID } from '@/lib/models';
import { SPELL_TYPE_ID } from '@/lib/spell';

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
