import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { SPELL_TYPE_ID, SpellInstance } from '@/lib/models';
import { spellData } from '../data';

export const getSpellInstance = (spellTypeId: SPELL_TYPE_ID): SpellInstance => {
	const spellConfig = cloneDeep(spellData[spellTypeId]);

	return {
		...spellConfig,
		spellId: uuidv4(),
	};
};
