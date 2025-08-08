import { Collapse } from 'react-bootstrap';
import { keyframes } from 'tss-react';
import classNames from 'classnames';
import { CharacterState } from '@/lib/character/character-class';
import { useBattle } from '@/hooks';
import { Meter, MeterAnimated, StatusEffect } from '@/components';
import { tss } from '@/styles';
import { useTheme } from '@/styles/hooks';
import { boxShadow } from '@/styles/mixins/box-shadow';

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
	characterOuter: {
		paddingTop: 92,
	},
	character: {
		position: 'relative',
		padding: '0 38px',
	},
	namePlate: {
		top: 0,
		zIndex: 1,
		width: 116,
		padding: 8,
		left: '50%',
		borderRadius: 8,
		overflow: 'hidden',
		textAlign: 'center',
		position: 'absolute',
		backgroundColor: theme.colors.gray800,
		...boxShadow(),
		transform: 'translate(-50%, calc(-100% - 8px))',
	},
	nameOuter: {
		padding: 4,
		borderRadius: 4,
		color: theme.colors.white,
		backgroundColor: theme.colors.gray900,
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
	avatarOuter: {
		zIndex: 0,
		position: 'relative',
		'&:after': {
			left: 0,
			right: 0,
			bottom: 0,
			zIndex: 0,
			height: 16,
			content: '""',
			borderRadius: '50%',
			position: 'absolute',
			transform: 'translateY(50%)',
			backgroundColor: 'rgba(0,0,0,0.32)',
		},
	},
	avatar: {
		width: 48,
		height: 48,
		zIndex: 1,
		overflow: 'hidden',
		borderRadius: '50%',
		position: 'relative',
		backgroundColor: theme.colors.primary,
		animation: `${castSpell} 1000ms linear forwards`,
	},
}));

interface CharacterProps {
	character: CharacterState;
	className?: string;
}

export const Character = ({ character, className }: CharacterProps) => {
	const { theme } = useTheme();
	const { battle } = useBattle();
	const { classes, cx } = useStyles();

	if (!battle) {
		return null;
	}

	return (
		<div className={classNames(classes.characterOuter, className)}>
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
					<Collapse in={!!character.isCastingSpell}>
						<div>
							<MeterAnimated
								title={character.isCastingSpell?.title ?? ''}
								className="mt-2"
								durationInMs={character.isCastingSpell?.castTimeAnimationDurationInMs ?? 0}
								color={theme.colors.warning}
							/>
						</div>
					</Collapse>
					<Collapse in={character.auras.length > 0}>
						<div>
							<div className="mt-2 d-flex" style={{ height: 24 }}>
								{character.auras.map((aura) => {
									return <StatusEffect key={aura.auraId} className="me-2" statusEffect={aura} />;
								})}
							</div>
						</div>
					</Collapse>
				</div>
				<div className={classes.avatarOuter}>
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
			</div>
		</div>
	);
};
