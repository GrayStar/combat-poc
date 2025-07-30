import { keyframes } from 'tss-react';
import { tss } from '@/styles';
import { StatusEffectState } from '@/lib/status-effect';

const cooldownAnimation = keyframes`
	from {
		height: 100%;
	}
	to {
		height: 0%;
	}
`;

interface UseStyleProps extends Record<string, unknown> {
	duration: number;
}

const useStyles = tss.withParams<UseStyleProps>().create(({ duration, ...theme }) => ({
	statusEffect: {
		zIndex: 0,
		width: 32,
		height: 32,
		borderRadius: 6,
		overflow: 'hidden',
		position: 'relative',
		backgroundColor: theme.colors.gray400,
	},
	cooldown: {
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1,
		height: '100%',
		position: 'absolute',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		animation: `${cooldownAnimation} ${duration}ms linear forwards`,
	},
	stackCount: {
		right: 4,
		bottom: 4,
		zIndex: 2,
		width: 16,
		height: 16,
		borderRadius: 4,
		position: 'absolute',
		textAlign: 'center',
		color: theme.colors.white,
		fontSize: theme.fonts.xs,
		lineHeight: '1.6rem',
		backgroundColor: theme.colors.black,
	},
}));

interface StatusEffectProps {
	statusEffect: StatusEffectState;
}

export const StatusEffect = ({ statusEffect }: StatusEffectProps) => {
	const { classes } = useStyles({ duration: statusEffect.durationInMs });

	return (
		<div className={classes.statusEffect}>
			<div className={classes.cooldown} />
			<p className="m-0">{statusEffect.title}</p>
			{(statusEffect.stacks ?? 0) > 0 && <div className={classes.stackCount}>{statusEffect.stacks}</div>}
		</div>
	);
};
