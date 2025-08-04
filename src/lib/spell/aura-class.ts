import { v4 as uuidv4 } from 'uuid';
import { AURA_DIRECTION_TYPE_ID, AURA_TYPE_ID, AuraEffectConfig } from '@/lib/spell/spell-models';
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
		return this.auraEffectConfigs.map((cfg) => getAuraEffectDescription(cfg, this.durationInMs)).join(' ');
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

function getAuraEffectDescription(
	{ auraTypeId, auraDirectionTypeId, value, schoolTypeId, intervalInMs }: AuraEffectConfig,
	durationMs: number
): string {
	const seconds = durationMs / 1000;
	const nothing = `Does nothing for ${seconds}s.`;
	const absValue = Math.abs(value);
	const verb = value > 0 ? 'Increases' : value < 0 ? 'Decreases' : '';

	const damageAction = auraDirectionTypeId === AURA_DIRECTION_TYPE_ID.OUTGOING ? 'damage dealt' : 'damage taken';
	const healingAction = auraDirectionTypeId === AURA_DIRECTION_TYPE_ID.OUTGOING ? 'healing done' : 'healing recieved';

	switch (auraTypeId) {
		case AURA_TYPE_ID.MODIFY_DAMAGE_FLAT:
			return value === 0 ? nothing : `${verb} ${damageAction} by ${absValue} for ${seconds}s.`;

		case AURA_TYPE_ID.MODIFY_DAMAGE_PERCENT:
			return value === 0 ? nothing : `${verb} ${damageAction} by ${absValue * 100}% for ${seconds}s.`;

		case AURA_TYPE_ID.MODIFY_DAMAGE_MULTIPLIER:
			return value === 0 ? nothing : `${value * 100}% ${damageAction} for ${seconds}s.`;

		case AURA_TYPE_ID.MODIFY_HEALING_FLAT:
			return value === 0 ? nothing : `${verb} ${healingAction} by ${absValue} for ${seconds}s.`;

		case AURA_TYPE_ID.MODIFY_HEALING_PERCENT:
			return value === 0 ? nothing : `${verb} ${healingAction} by ${absValue * 100}% for ${seconds}s.`;

		case AURA_TYPE_ID.MODIFY_HEALING_MULTIPLIER:
			return value === 0 ? nothing : `${value * 100}% ${healingAction} for ${seconds}s.`;

		case AURA_TYPE_ID.PERIODIC_DAMAGE:
			return value === 0
				? nothing
				: `Deals ${value} ${schoolTypeId} damage every ${intervalInMs / 1000}s for ${seconds}s.`;

		case AURA_TYPE_ID.PERIODIC_HEAL:
			return value === 0 ? nothing : `Heals for ${value} every ${intervalInMs / 1000}s for ${seconds}s.`;

		default:
			return nothing;
	}
}
