import { keyframes } from 'tss-react';
import { CharacterState } from '@/lib/character/character-class';
import { useBattle } from '@/hooks';
import { Meter, MeterAnimated, StatusEffect } from '@/components';
import { tss } from '@/styles';
import { useTheme } from '@/styles/hooks';
import classNames from 'classnames';

const damageFlash = keyframes`
	from {
		opacity: 80%;
	}
	to {
		opacity: 0%;
	}
`;

const healingFlash = keyframes`
	from {
		opacity: 80%;
		height: 0%;
	}
	to {
		opacity: 0%;
		height: 100%;
	}
`;

const castSpell = keyframes`
	0% {
		transform: translateY(0);
	}
	10% {
		transform: translateY(-20px);
	}
	20% {
		transform: translateY(4px);
	}
	30% {
		transform: translateY(-2px);
	}
	40% {
		transform: translateY(1px);
	}
	100% {
		transform: translateY(0px);
	}
`;

const useStyles = tss.create((theme) => ({
	character: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	namePlate: {
		zIndex: 0,
		width: 128,
		padding: 8,
		borderRadius: 8,
		marginBottom: 8,
		overflow: 'hidden',
		textAlign: 'center',
		position: 'relative',
		backgroundColor: theme.colors.gray200,
	},
	nameOuter: {
		padding: 4,
		borderRadius: 4,
		color: theme.colors.white,
		backgroundColor: theme.colors.gray800,
	},
	indicator: {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1,
		position: 'absolute',
	},
	damageIndicator: {
		backgroundColor: theme.colors.danger,
		animation: `${damageFlash} 500ms linear forwards`,
	},
	healingIndicator: {
		top: 'auto',
		backgroundColor: theme.colors.white,
		animation: `${healingFlash} 500ms linear forwards`,
	},
	avatar: {
		width: 48,
		height: 48,
		overflow: 'hidden',
		borderRadius: '50%',
		position: 'relative',
		backgroundColor: theme.colors.primary,
		animation: `${castSpell} 1000ms linear forwards`,
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
			<div className={classes.namePlate}>
				<div className={cx('mb-2', classes.nameOuter)}>
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
						durationInMs={character.isCastingSpell.castTimeAnimationDurationInMs ?? 0}
						color={theme.colors.warning}
					/>
				)}
				{character.auras.length > 0 && (
					<div className="mt-2 d-flex">
						{character.auras.map((aura) => {
							return <StatusEffect key={aura.auraId} statusEffect={aura} />;
						})}
					</div>
				)}
			</div>
			<div className={classes.avatar} key={character.renderKeyCastSpell}>
				{character.renderKeyDamage && (
					<div
						className={classNames(classes.indicator, classes.damageIndicator)}
						key={character.renderKeyDamage}
					/>
				)}
				{character.renderKeyHealing && (
					<div
						className={classNames(classes.indicator, classes.healingIndicator)}
						key={character.renderKeyHealing}
					/>
				)}
			</div>
		</div>
	);
};
