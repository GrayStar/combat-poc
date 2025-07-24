import { v4 as uuidv4 } from 'uuid';
import { statusEffectData } from '@/lib/data';
import { STATUS_EFFECT_IDS, StatusEffectModel } from '@/lib/models';

export type StatusEffectComposite = StatusEffectModel & { id: string; resetCounter: number };
export type StatusEffectInstance = ReturnType<typeof StatusEffect>;

const resetCounterIncreaser = (statusEffect: StatusEffectComposite) => ({
	increaseResetCounter() {
		statusEffect.resetCounter++;
	},
});

export function StatusEffect(statusEffectId: STATUS_EFFECT_IDS) {
	const statusEffectConfig = { ...statusEffectData[statusEffectId] };
	const statusEffectComposite = {
		...statusEffectConfig,
		id: uuidv4(),
		resetCounter: 0,
	};

	/* --------------------------------------------------------------------- */
	/* Interval methods */
	/* --------------------------------------------------------------------- */
	let intervalCallback: (() => void) | undefined = undefined;
	let interval: NodeJS.Timeout | undefined = undefined;

	const setIntervalCallback = (callback: () => void) => {
		intervalCallback = callback;
	};

	const startInterval = () => {
		if (interval) {
			stopInterval();
		}

		interval = setInterval(() => {
			intervalCallback?.();
		}, statusEffectComposite.interval);
	};

	const stopInterval = () => {
		if (!interval) {
			return;
		}

		clearInterval(interval);
		interval = undefined;
	};

	/* --------------------------------------------------------------------- */
	/* Timeout methods */
	/* --------------------------------------------------------------------- */
	let timeoutCallback: (() => void) | undefined = undefined;
	let timeout: NodeJS.Timeout | undefined = undefined;

	const setTimeoutCallback = (callback: () => void) => {
		timeoutCallback = callback;
	};

	const startTimeout = () => {
		if (timeout) {
			return;
		}

		timeout = setTimeout(() => {
			timeoutCallback?.();
			stopInterval();
		}, statusEffectComposite.duration);

		startInterval();
	};

	const stopTimeout = () => {
		if (!timeout) {
			return;
		}

		stopInterval();
		clearTimeout(timeout);
		timeout = undefined;
	};

	const resetTimeout = () => {
		if (timeout) {
			stopTimeout();
			startTimeout();
		}
	};

	return Object.assign(statusEffectComposite, resetCounterIncreaser(statusEffectComposite), {
		setIntervalCallback,
		setTimeoutCallback,
		startTimeout,
		stopTimeout,
		resetTimeout,
	});
}

export default StatusEffect;
