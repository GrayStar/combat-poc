import { useEffect, useRef } from 'react';
import { StatusEffectInstance } from '@/lib/models';
import React from 'react';

interface StatusEffectProps {
	statusEffect: StatusEffectInstance;
	intervalCallback(statusEffect: StatusEffectInstance): void;
	timeoutCallback(statusEffect: StatusEffectInstance): void;
}

export const StatusEffect = React.memo(({ statusEffect, intervalCallback, timeoutCallback }: StatusEffectProps) => {
	const statusEffectRef = useRef(statusEffect);
	const intervalRef = useRef<NodeJS.Timeout>(undefined);
	const timeoutRef = useRef<NodeJS.Timeout>(undefined);
	const intervalCallbackRef = useRef(intervalCallback);
	const timeoutCallbackRef = useRef(timeoutCallback);

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
		<div>
			<p className="m-0">{statusEffect.title}</p>
		</div>
	);
});
