import { getSpellInstance, SPELL_TYPE_ID, SpellInstance } from '@/lib/spell';

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
	spellTypeIds: SPELL_TYPE_ID[]
): SpellCaster & { spellsBySpellId: Record<string, SpellInstance> } {
	const spellsBySpellId = getRecordOfSpellInstancesBySpellId(spellTypeIds);

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

const getRecordOfSpellInstancesBySpellId = (spellTypeIds: SPELL_TYPE_ID[]) => {
	return spellTypeIds.reduce((accumulator, currentValue) => {
		const spellInstance = getSpellInstance(currentValue);

		return {
			...accumulator,
			[spellInstance.spellId]: spellInstance,
		};
	}, {} as Record<string, SpellInstance>);
};
