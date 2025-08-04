import { v4 as uuidv4 } from 'uuid';
import { AURA_TYPE_ID, AuraEffectConfig } from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spell/spell-data';

type IntervalTimer = ReturnType<typeof setTimeout>;
type TimeoutTimer = ReturnType<typeof setTimeout>;

export type AuraState = {
	auraId: string;
	renderKey: string;
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
	public readonly spellTypeId: SPELL_TYPE_ID;
	public readonly auraEffectConfigs: AuraEffectConfig[];
	public readonly durationInMs: number;

	private _renderKey: string = '';
	private _intervalTimers: IntervalTimer[] = [];
	private _timeoutTimer: TimeoutTimer | null = null;

	constructor(
		config: AuraConfig,
		private readonly intervalCallback: (auraId: string, effects: AuraEffectConfig[]) => void,
		private readonly timeoutCallback: (auraId: string) => void
	) {
		this.auraId = uuidv4();
		this.title = config.title;
		this.spellTypeId = config.spellTypeId;
		this.auraEffectConfigs = config.auraEffectConfigs;
		this.durationInMs = config.durationInMs;

		this.restartTimers();
	}

	private clearInternalTimers() {
		this._intervalTimers.forEach(clearInterval);
		this._intervalTimers = [];
		if (this._timeoutTimer) {
			clearTimeout(this._timeoutTimer);
			this._timeoutTimer = null;
		}
	}

	public stopTimers() {
		this.clearInternalTimers();
	}

	public restartTimers() {
		this.clearInternalTimers();

		const auraEffectsMappedByInterval = new Map<number, AuraEffectConfig[]>();
		for (const effect of this.auraEffectConfigs) {
			if (effect.intervalInMs <= 0) continue;
			const bucket = auraEffectsMappedByInterval.get(effect.intervalInMs) || [];
			bucket.push(effect);
			auraEffectsMappedByInterval.set(effect.intervalInMs, bucket);
		}

		for (const [interval, effects] of auraEffectsMappedByInterval) {
			const id = setInterval(() => {
				this.intervalCallback(this.auraId, effects);
			}, interval);
			this._intervalTimers.push(id);
		}

		this._timeoutTimer = setTimeout(() => {
			this.clearInternalTimers();
			this.timeoutCallback(this.auraId);
		}, this.durationInMs);

		this._renderKey = uuidv4();
	}

	private getDescription(): string {
		return this.auraEffectConfigs
			.map((cfg) => auraEffectDescriptionMap[cfg.auraTypeId](cfg, this.durationInMs))
			.join(' ');
	}

	public getState(): AuraState {
		return {
			auraId: this.auraId,
			renderKey: this._renderKey,
			title: this.title,
			description: this.getDescription(),
			durationInMs: this.durationInMs,
		};
	}
}

const auraEffectDescriptionMap: Record<AURA_TYPE_ID, (config: AuraEffectConfig, durationInMs: number) => string> = {
	[AURA_TYPE_ID.MODIFY_OUTGOING_DAMAGE_FLAT]: ({ value }, durationInMs) => {
		if (value > 0) {
			return `Increases damage dealt by ${value} for ${durationInMs / 1000}s.`;
		} else if (value < 0) {
			return `Decreases damage dealt by ${Math.abs(value)} for ${durationInMs / 1000}s.`;
		}
		return `Does nothing for ${durationInMs / 1000}s.`;
	},
	[AURA_TYPE_ID.MOFIFY_OUTGOING_DAMAGE_PERCENT]: ({ value }, durationInMs) => {
		if (value > 0) {
			return `Increases damage dealt by ${value * 100}% for ${durationInMs / 1000}s.`;
		} else if (value < 0) {
			return `Decreases damage dealt by ${Math.abs(value * 100)}% for ${durationInMs / 1000}s.`;
		}
		return `Does nothing.`;
	},
	[AURA_TYPE_ID.MODIFY_OUTGOING_DAMAGE_MULTIPLIER]: ({ value }, durationInMs) => {
		if (value !== 0) {
			return `${value * 100}% damage dealt for ${durationInMs / 1000}s.`;
		}
		return `Does nothing for ${durationInMs / 1000}s.`;
	},
	[AURA_TYPE_ID.PERIODIC_DAMAGE]: ({ value, schoolTypeId, intervalInMs }, durationInMs) => {
		return `Deals ${value} ${schoolTypeId} damage every ${intervalInMs / 1000}s for ${durationInMs / 1000}s.`;
	},
};
