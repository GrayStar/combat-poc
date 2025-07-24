import { v4 as uuidv4 } from 'uuid';
import { CHARACTER_TYPE_IDS, CharacterComposite } from '@/lib/models';
import { healthAdjuster, manaAdjuster, spellCaster, spellReciever, statusEffectApplier } from '@/ecs/actions';
import { characterData } from '@/lib/data/character-data';

export type CharacterInstance = ReturnType<typeof CharacterEntity>;

export const CharacterEntity = (characterTypeId: CHARACTER_TYPE_IDS) => {
	const characterConfig = characterData[characterTypeId];
	const characterComposite: CharacterComposite = {
		...characterConfig,
		id: uuidv4(),
	};

	const withHealth = healthAdjuster(characterComposite, characterComposite.maxHealth);
	const withMana = manaAdjuster(withHealth, withHealth.maxMana);
	const withStatusEffectApplier = statusEffectApplier(withMana);
	const withSpellCaster = spellCaster(withStatusEffectApplier);
	const withSpellReciever = spellReciever(withSpellCaster);

	return withSpellReciever;
};
