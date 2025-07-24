export enum SPELL_IDS {
	FIREBALL = 'FIREBALL',
	HEAL = 'HEAL',
}

export interface SpellModel {
	spellId: SPELL_IDS;
	title: string;
	description: string;
	castTimeDurationInMs: number;
	casterEffects?: SpellEffect;
	targetEffects?: SpellEffect;
}

export interface SpellEffect {
	resources: SpellResource;
}

export interface SpellResource {
	health?: number;
	mana?: number;
}
