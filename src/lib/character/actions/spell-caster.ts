import { SPELL_TYPE_ID, SpellInstance } from '@/lib/spell';
import { getSpellInstance } from '@/lib/utils';

export type SpellCasterComponents = {
	readonly spellIds: string[];
	readonly isCasting: boolean;
};

export type SpellCasterSystems = {
	getSpellIds(): string[];
	setSpellIds(spellIds: string[]): void;
	getIsCasting(): boolean;
	setIsCasting(isCasting: boolean): void;
};

export type SpellCaster = SpellCasterComponents & SpellCasterSystems;

export function spellCaster(
	spellTypeIds: SPELL_TYPE_ID[]
): SpellCaster & { spellsBySpellId: Record<string, SpellInstance> } {
	const spellsBySpellId = getRecordOfSpellInstancesBySpellId(spellTypeIds);

	let spellIds = Object.keys(spellsBySpellId);
	let isCasting = false;

	const components: SpellCasterComponents = {
		get spellIds() {
			return spellIds;
		},
		get isCasting() {
			return isCasting;
		},
	};

	const systems: SpellCasterSystems = {
		getSpellIds() {
			return spellIds;
		},
		setSpellIds(value) {
			spellIds = value;
		},
		getIsCasting() {
			return isCasting;
		},
		setIsCasting(value) {
			isCasting = value;
		},
	};

	return {
		spellsBySpellId,
		...components,
		...systems,
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
