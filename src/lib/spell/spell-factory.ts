import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { SPELL_TYPE_ID, spellData, SpellInstance } from '@/lib/spell';

export const getSpellInstance = (spellTypeId: SPELL_TYPE_ID): SpellInstance => {
	const spellConfig = cloneDeep(spellData[spellTypeId]);

	return {
		...spellConfig,
		spellId: uuidv4(),
		isOnCooldown: false,
	};
};
