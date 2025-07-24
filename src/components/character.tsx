import { Meter } from '@/components';
import { useTheme } from '@/styles/hooks';

interface CharacterProps {
	title: string;
	health: number;
	maxHealth: number;
	mana: number;
	maxMana: number;
}

export const Character = ({ title, health, maxHealth, mana, maxMana }: CharacterProps) => {
	const { theme } = useTheme();

	return (
		<div>
			<p className="m-0">
				HP: {health}/{maxHealth}
			</p>
			<Meter value={health} maxValue={maxHealth} color={theme.colors.success} />
			<p className="m-0">
				MP: {mana}/{maxMana}
			</p>
			<Meter value={mana} maxValue={maxMana} color={theme.colors.info} />
			<h5 className="m-0">{title}</h5>
		</div>
	);
};
