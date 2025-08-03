import { v4 as uuidv4 } from 'uuid';
import { AuraEffectConfig } from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spell/spell-data';

type Timer = ReturnType<typeof setInterval> | ReturnType<typeof setTimeout>;

export type AuraState = {
	auraId: string;
	title: string;
	description: string;
	durationInMs: number;
};

export type AuraConfig = {
	title: string;
	spellTypeId: SPELL_TYPE_ID;
	durationInMs: number;
	auraEffectConfigs: AuraEffectConfig[];
};

export class Aura {
	public readonly auraId: string;
	public readonly title: string;
	public readonly auraEffectConfigs: AuraEffectConfig[];
	public readonly durationInMs: number;

	private _intervalTimers: Timer[] = [];
	private _timeoutTimer: Timer | null = null;

	constructor(
		config: {
			title: string;
			spellTypeId: SPELL_TYPE_ID;
			auraEffectConfigs: AuraEffectConfig[];
			durationInMs: number;
		},
		private readonly intervalCallback: (auraId: string, effects: AuraEffectConfig[]) => void,
		private readonly timeoutCallback: (auraId: string) => void
	) {
		this.auraId = uuidv4();
		this.title = config.title;
		this.auraEffectConfigs = config.auraEffectConfigs;
		this.durationInMs = config.durationInMs;

		const intervalToSpellsEffectsMap = new Map<number, AuraEffectConfig[]>();
		for (const spellEffect of this.auraEffectConfigs) {
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
			description: `${this.auraEffectConfigs.length} effect(s) active`,
			durationInMs: this.durationInMs,
		};
	}
}
