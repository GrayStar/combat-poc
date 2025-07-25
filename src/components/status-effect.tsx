import { useCallback, useEffect, useRef } from 'react';
import { StatusEffectInstance } from '@/lib/models';

interface StatusEffectProps {
	statusEffect: StatusEffectInstance;
	intervalCallback(statusEffect: StatusEffectInstance): void;
	timeoutCallback(statusEffect: StatusEffectInstance): void;
}

export const StatusEffect = ({ statusEffect, intervalCallback, timeoutCallback }: StatusEffectProps) => {
	const intervalRef = useRef<NodeJS.Timeout>(undefined);
	const timeoutRef = useRef<NodeJS.Timeout>(undefined);

	const startInterval = useCallback(() => {
		if (intervalRef.current) {
			stopInterval();
		}

		intervalRef.current = setInterval(() => {
			intervalCallback(statusEffect);
		}, statusEffect.interval);
	}, [intervalCallback, statusEffect]);

	const stopInterval = () => {
		if (!intervalRef.current) {
			return;
		}

		clearInterval(intervalRef.current);
		intervalRef.current = undefined;
	};

	const startTimeout = useCallback(() => {
		if (timeoutRef.current) {
			stopTimeout();
		}

		setTimeout(() => {
			stopInterval();
			timeoutCallback(statusEffect);
		}, statusEffect.duration);
	}, [statusEffect, timeoutCallback]);

	const stopTimeout = () => {
		if (!timeoutRef.current) {
			return;
		}

		clearTimeout(timeoutRef.current);
		timeoutRef.current = undefined;
	};

	useEffect(() => {
		startTimeout();
		startInterval();
	}, [startInterval, startTimeout]);

	return (
		<div>
			<p className="m-0">{statusEffect.title}</p>
		</div>
	);
};
