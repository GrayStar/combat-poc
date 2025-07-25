import { useEffect, useRef } from 'react';
import { keyframes } from 'tss-react';
import { StatusEffectInstance } from '@/lib/models';
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
	duration: number;
}

const useStyles = tss.withParams<UseStyleProps>().create(({ duration, ...theme }) => ({
	statusEffect: {
		width: 32,
		height: 32,
		borderRadius: 4,
		overflow: 'hidden',
		position: 'relative',
		backgroundColor: theme.colors.gray400,
	},
	cooldown: {
		left: 0,
		right: 0,
		bottom: 0,
		height: '100%',
		position: 'absolute',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		animation: `${cooldownAnimation} ${duration}ms linear forwards`,
	},
	stackCount: {
		right: 0,
		bottom: 0,
		position: 'absolute',
	},
}));

interface StatusEffectProps {
	statusEffect: StatusEffectInstance;
	intervalCallback(statusEffect: StatusEffectInstance): void;
	timeoutCallback(statusEffect: StatusEffectInstance): void;
}

export const StatusEffect = ({ statusEffect, intervalCallback, timeoutCallback }: StatusEffectProps) => {
	const statusEffectRef = useRef(statusEffect);
	const intervalRef = useRef<NodeJS.Timeout>(undefined);
	const timeoutRef = useRef<NodeJS.Timeout>(undefined);
	const intervalCallbackRef = useRef(intervalCallback);
	const timeoutCallbackRef = useRef(timeoutCallback);

	const { classes } = useStyles({ duration: statusEffectRef.current.duration });

	useEffect(() => {
		statusEffectRef.current = statusEffect;
		intervalCallbackRef.current = intervalCallback;
		timeoutCallbackRef.current = timeoutCallback;
	}, [statusEffect, intervalCallback, timeoutCallback]);

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			intervalCallbackRef.current(statusEffectRef.current);
		}, statusEffectRef.current.interval);

		timeoutRef.current = setTimeout(() => {
			if (!intervalRef.current) {
				return;
			}

			clearInterval(intervalRef.current);
			intervalRef.current = undefined;

			timeoutCallbackRef.current(statusEffectRef.current);
		}, statusEffectRef.current.duration);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = undefined;
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = undefined;
			}
		};
	}, []);

	return (
		<div className={classes.statusEffect}>
			<div className={classes.cooldown} />
			<p className="m-0">{statusEffectRef.current.title}</p>
			<div className={classes.stackCount}>{statusEffectRef.current.stacks}</div>
		</div>
	);
};
