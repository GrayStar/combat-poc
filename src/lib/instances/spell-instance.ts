import { v4 as uuidv4 } from 'uuid';

import { SPELL_IDS } from '@/lib/models';
import { spellData } from '@/lib/data';

export type SpellInstance = ReturnType<typeof SpellEntity>;

export function SpellEntity(spellId: SPELL_IDS) {
	const spellConfig = spellData[spellId];
	const spellComposite = {
		...spellConfig,
		id: uuidv4(),
		isCoolingDown: false,
		isGloballyCoolingDown: false,
	};

	return {
		...spellComposite,
	};
}
