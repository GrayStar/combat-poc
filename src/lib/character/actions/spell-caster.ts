import { Spell, SPELL_TYPE_ID, SpellInstance } from '@/lib/spell';

export type SpellCasterComponents = {
	spellIds: string[];
	isCasting: boolean;
};

export type SpellCasterSystems = {
	setSpellIds(spellIds: string[]): void;
	setIsCasting(isCasting: boolean): void;
};

export type SpellCaster = SpellCasterComponents & SpellCasterSystems;

export function spellCaster(
	spellTypeIds: SPELL_TYPE_ID[],
	notify: () => void
): SpellCaster & { spellsBySpellId: Record<string, SpellInstance> } {
	const spellsBySpellId = getRecordOfSpellInstancesBySpellId(spellTypeIds, notify);

	return {
		spellsBySpellId,
		spellIds: Object.keys(spellsBySpellId),
		isCasting: false,
		setSpellIds(value) {
			this.spellIds = value;
		},
		setIsCasting(value) {
			this.isCasting = value;
		},
	};
}

const getRecordOfSpellInstancesBySpellId = (spellTypeIds: SPELL_TYPE_ID[], notify: () => void) => {
	return spellTypeIds.reduce((accumulator, currentValue) => {
		const spellInstance = Spell(currentValue, notify);

		return {
			...accumulator,
			[spellInstance.spellId]: spellInstance,
		};
	}, {} as Record<string, SpellInstance>);
};
