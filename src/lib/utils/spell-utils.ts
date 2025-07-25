import { v4 as uuidv4 } from 'uuid';
import { SpellInstance, SpellModel } from '@/lib/models';

export const getSpellInstance = (spell: SpellModel): SpellInstance => {
	return {
		...spell,
		spellId: uuidv4(),
	};
};
