import { v4 as uuidv4 } from 'uuid';
import { AURA_DIRECTION_TYPE_ID, AURA_TYPE_ID, AuraEffectConfig, DISPEL_TYPE_ID } from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spell/spell-data';

type IntervalTimer = ReturnType<typeof setTimeout>;
type TimeoutTimer = ReturnType<typeof setTimeout>;

export type AuraState = {
	auraId: string;
	renderKey: string;
	title: string;
	description: string;
	durationInMs: number;
	dispelTypeId: DISPEL_TYPE_ID;
};

export type AuraConfig = {
	title: string;
	spellTypeId: SPELL_TYPE_ID;
	durationInMs: number;
	auraEffectConfigs: AuraEffectConfig[];
	dispelTypeId: DISPEL_TYPE_ID;
};

export class Aura {
	public readonly auraId: string;
	public readonly title: string;
	public readonly spellTypeId: SPELL_TYPE_ID;
	public readonly auraEffectConfigs: AuraEffectConfig[];
	public readonly durationInMs: number;
	public readonly dispelTypeId: DISPEL_TYPE_ID;

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
		this.dispelTypeId = config.dispelTypeId;

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
			if (effect.intervalInMs <= 0) {
				continue;
			}

			const auraEffectGroup = auraEffectsMappedByInterval.get(effect.intervalInMs) ?? [];
			auraEffectGroup.push(effect);
			auraEffectsMappedByInterval.set(effect.intervalInMs, auraEffectGroup);
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
			dispelTypeId: this.dispelTypeId,
		};
	}
}

function getAuraEffectDescription(
	{ auraTypeId, auraDirectionTypeId, value, schoolTypeId, intervalInMs }: AuraEffectConfig,
	durationMs: number
): string {
	const intervalInSeconds = intervalInMs / 1000;
	const durationInSeconds = durationMs / 1000;
	const nothing = `Does nothing for ${durationInSeconds}s.`;
	const absValue = Math.abs(value);
	const verb = value > 0 ? 'Increases' : value < 0 ? 'Decreases' : '';

	const damageAction = auraDirectionTypeId === AURA_DIRECTION_TYPE_ID.OUTGOING ? 'damage dealt' : 'damage taken';
	const healingAction = auraDirectionTypeId === AURA_DIRECTION_TYPE_ID.OUTGOING ? 'healing done' : 'healing recieved';

	switch (auraTypeId) {
		case AURA_TYPE_ID.MODIFY_DAMAGE_FLAT:
			return value === 0 ? nothing : `${verb} ${damageAction} by ${absValue} for ${durationInSeconds}s.`;

		case AURA_TYPE_ID.MODIFY_DAMAGE_PERCENT:
			return value === 0 ? nothing : `${verb} ${damageAction} by ${absValue * 100}% for ${durationInSeconds}s.`;

		case AURA_TYPE_ID.MODIFY_DAMAGE_MULTIPLIER:
			return value === 0 ? nothing : `${value * 100}% ${damageAction} for ${durationInSeconds}s.`;

		case AURA_TYPE_ID.MODIFY_HEALING_FLAT:
			return value === 0 ? nothing : `${verb} ${healingAction} by ${absValue} for ${durationInSeconds}s.`;

		case AURA_TYPE_ID.MODIFY_HEALING_PERCENT:
			return value === 0 ? nothing : `${verb} ${healingAction} by ${absValue * 100}% for ${durationInSeconds}s.`;

		case AURA_TYPE_ID.MODIFY_HEALING_MULTIPLIER:
			return value === 0 ? nothing : `${value * 100}% ${healingAction} for ${durationInSeconds}s.`;

		case AURA_TYPE_ID.PERIODIC_DAMAGE:
			return value === 0
				? nothing
				: `Deals ${value} ${schoolTypeId} damage every ${intervalInSeconds}s for ${durationInSeconds}s.`;

		case AURA_TYPE_ID.PERIODIC_HEAL:
			return value === 0 ? nothing : `Heals for ${value} every ${intervalInSeconds}s for ${durationInSeconds}s.`;

		default:
			return nothing;
	}
}
