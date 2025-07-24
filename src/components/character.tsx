interface CharacterProps {
	title: string;
	health: number;
	maxHealth: number;
	mana: number;
	maxMana: number;
}

export const Character = ({ title, health, maxHealth, mana, maxMana }: CharacterProps) => {
	return (
		<div>
			<p className="m-0">{title}</p>
			<p className="m-0">
				health: {health}/{maxHealth}
			</p>
			<p className="m-0">
				mana: {mana}/{maxMana}
			</p>
		</div>
	);
};
