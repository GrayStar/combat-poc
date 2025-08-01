import { v4 as uuidv4 } from 'uuid';
import { SpellEffectApplyAura } from '@/lib/spell/spell-models';

type Timer = ReturnType<typeof setInterval> | ReturnType<typeof setTimeout>;

export type AuraState = {
	auraId: string;
	title: string;
	description: string;
	durationInMs: number;
};

export class Aura {
	public readonly auraId: string;
	public readonly title: string;
	public readonly spellEffects: SpellEffectApplyAura[];
	public readonly durationInMs: number;

	private _intervalTimers: Timer[] = [];
	private _timeoutTimer: Timer | null = null;

	constructor(
		config: {
			auraTitle: string;
			spellEffects: SpellEffectApplyAura[];
			durationInMs: number;
		},
		private readonly intervalCallback: (auraId: string, effects: SpellEffectApplyAura[]) => void,
		private readonly timeoutCallback: (auraId: string) => void
	) {
		this.auraId = uuidv4();
		this.title = config.auraTitle;
		this.spellEffects = config.spellEffects;
		this.durationInMs = config.durationInMs;

		const intervalToSpellsEffectsMap = new Map<number, SpellEffectApplyAura[]>();
		for (const spellEffect of this.spellEffects) {
			const currentSpellEffectIntervalInMs = spellEffect.intervalInMs;

			if (currentSpellEffectIntervalInMs <= 0) {
				continue;
			}

			let spellEffectBucket = intervalToSpellsEffectsMap.get(currentSpellEffectIntervalInMs);

			if (!spellEffectBucket) {
				spellEffectBucket = [];
				intervalToSpellsEffectsMap.set(currentSpellEffectIntervalInMs, spellEffectBucket);
			}
			spellEffectBucket.push(spellEffect);
		}

		for (const [tick, effects] of intervalToSpellsEffectsMap) {
			const timerId = setInterval(() => {
				this.intervalCallback(this.auraId, effects);
			}, tick);
			this._intervalTimers.push(timerId);
		}

		this._timeoutTimer = setTimeout(() => {
			this.clearInternalTimers();
			this.timeoutCallback(this.auraId);
		}, config.durationInMs);
	}

	private clearInternalTimers() {
		this._intervalTimers.forEach(clearInterval);
		this._intervalTimers = [];
		if (this._timeoutTimer) {
			clearTimeout(this._timeoutTimer);
			this._timeoutTimer = null;
		}
	}

	/** Manual removal (e.g. dispel) */
	/** Remove early (e.g. dispel) */
	public stopTimers() {
		this.clearInternalTimers();
	}

	public getState(): AuraState {
		return {
			auraId: this.auraId,
			title: this.title,
			description: `${this.spellEffects.length} effect(s) active`,
			durationInMs: this.durationInMs,
		};
	}
}
