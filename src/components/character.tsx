import { CharacterState } from '@/lib/character';
import { Meter, StatusEffect } from '@/components';
import { useTheme } from '@/styles/hooks';
import { useBattle } from '@/hooks';

interface CharacterProps {
	character: CharacterState;
}

export const Character = ({ character }: CharacterProps) => {
	const { theme } = useTheme();
	const { battle } = useBattle();

	if (!battle) {
		return null;
	}

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
				{character.statusEffectIds.map((statusEffectId) => {
					const statusEffect = battle.statusEffects[statusEffectId];
					return <StatusEffect key={statusEffect.statusEffectId} statusEffect={statusEffect} />;
				})}
			</div>
		</div>
	);
};
