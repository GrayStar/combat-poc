import { CharacterState } from '@/lib/character';
import { Meter, MeterAnimated, StatusEffect } from '@/components';
import { useBattle } from '@/hooks';
import { tss } from '@/styles';
import { useTheme } from '@/styles/hooks';

const useStyles = tss.create((theme) => ({
	character: {
		width: 128,
		padding: 8,
		borderRadius: 8,
		overflow: 'hidden',
		textAlign: 'center',
		position: 'relative',
		backgroundColor: theme.colors.gray200,
	},
	namePlate: {
		padding: 4,
		borderRadius: 4,
		color: theme.colors.white,
		backgroundColor: theme.colors.gray800,
	},
}));

interface CharacterProps {
	character: CharacterState;
}

export const Character = ({ character }: CharacterProps) => {
	const { theme } = useTheme();
	const { battle } = useBattle();
	const { classes, cx } = useStyles();

	if (!battle) {
		return null;
	}

	return (
		<div className={classes.character}>
			<div className={cx('mb-2', classes.namePlate)}>
				<h6 className="mb-0 small">{character.title}</h6>
			</div>
			<Meter
				showValue
				className="mt-2"
				value={character.health}
				maxValue={character.maxHealth}
				color={theme.colors.success}
			/>
			<Meter
				showValue
				className="mt-2"
				value={character.mana}
				maxValue={character.maxMana}
				color={theme.colors.info}
			/>
			{character.isCastingSpell && (
				<MeterAnimated
					title={character.isCastingSpell.title}
					className="mt-2"
					durationInMs={character.isCastingSpell.castTimeDurationInMs ?? 0}
					color={theme.colors.warning}
				/>
			)}
			{character.statusEffectIds.length > 0 && (
				<div className="mt-2 d-flex">
					{character.statusEffectIds.map((statusEffectId) => {
						const statusEffect = battle.statusEffects[statusEffectId];
						return <StatusEffect key={statusEffect.statusEffectId} statusEffect={statusEffect} />;
					})}
				</div>
			)}
		</div>
	);
};
