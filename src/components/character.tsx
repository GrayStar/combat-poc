import { Meter, StatusEffect } from '@/components';
import { useBattle } from '@/hooks';
import { CharacterInstance } from '@/lib/models';
import { useTheme } from '@/styles/hooks';

interface CharacterProps {
	character: CharacterInstance;
}

export const Character = ({ character }: CharacterProps) => {
	const { theme } = useTheme();
	const { handleStatusEffectTimeout, handleStatusEffectInterval } = useBattle();

	return (
		<div>
			<h5 className="m-0">{character.title}</h5>
			<p className="m-0">
				HP: {character.health}/{character.maxHealth}
			</p>
			<Meter value={character.health} maxValue={character.maxHealth} color={theme.colors.success} />
			<p className="m-0">
				MP: {character.mana}/{character.maxMana}
			</p>
			<Meter value={character.mana} maxValue={character.maxMana} color={theme.colors.info} />
			<div className="d-flex">
				{Object.entries(character.statusEffects).map(([key, value]) => (
					<StatusEffect
						key={key}
						statusEffect={value}
						intervalCallback={(se) => handleStatusEffectInterval(se, character.characterId)}
						timeoutCallback={(se) => handleStatusEffectTimeout(se, character.characterId)}
					/>
				))}
			</div>
		</div>
	);
};
