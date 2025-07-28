// import { Spell, SPELL_TYPE_ID, SpellInstance } from '@/lib/spell';

export type SpellCasterComponents = {
	spellIds: string[];
	isCasting: boolean;
};

export type SpellCasterSystems = {
	setSpellIds(spellIds: string[]): void;
	setIsCasting(isCasting: boolean): void;
};

export type SpellCaster = SpellCasterComponents & SpellCasterSystems;

export function spellCaster(): SpellCaster {
	return {
		spellIds: [],
		isCasting: false,
		setSpellIds(value) {
			this.spellIds = value;
		},
		setIsCasting(value) {
			this.isCasting = value;
		},
	};
}
