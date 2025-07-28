import { keyframes } from 'tss-react';
import { SpellInstance } from '@/lib/spell';
import { tss } from '@/styles';

const cooldownAnimation = keyframes`
	from {
		height: 100%;
	}
	to {
		height: 0%;
	}
`;

interface UseStyleProps extends Record<string, unknown> {
	cooldownDurationInMs: number;
}

const useStyles = tss.withParams<UseStyleProps>().create(({ cooldownDurationInMs, ...theme }) => ({
	spell: {
		width: 48,
		height: 48,
		borderRadius: 8,
		overflow: 'hidden',
		position: 'relative',
		backgroundColor: theme.colors.gray400,
		border: `1px solid ${theme.colors.black}`,
	},
	cooldown: {
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1,
		height: '100%',
		position: 'absolute',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		animation: `${cooldownAnimation} ${cooldownDurationInMs}ms linear forwards`,
	},
}));

interface SpellProps {
	spell: SpellInstance;
}

export const Spell = ({ spell }: SpellProps) => {
	const { classes } = useStyles({ cooldownDurationInMs: spell.cooldownDurationInMs });
	return (
		<div className={classes.spell}>
			{spell.isOnCooldown && <div className={classes.cooldown} />}
			{spell.title}
		</div>
	);
};
