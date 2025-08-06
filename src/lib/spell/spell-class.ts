import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { SPELL_TYPE_ID, spellData } from '@/lib/spell/spell-data';
import { AuraModel, SCHOOL_TYPE_ID, SpellEffectModel } from '@/lib/spell/spell-models';

export type SpellState = {
	spellId: string;
	spellTypeId: SPELL_TYPE_ID;
	title: string;
	description: string;
	effects: string;
	castTimeDurationInMs: number;
	castTimeDescription: string;
	cooldownDurationInMs: number;
	cooldownDescription: string;
	isOnCooldown: boolean;
};

export class Spell {
	public readonly spellId: string;
	public readonly spellTypeId: SPELL_TYPE_ID;
	public readonly title: string;
	public readonly description: string;
	public readonly castTimeDurationInMs: number;
	public readonly cooldownDurationInMs: number;
	public readonly globalCooldownDurationInMs: number;
	public readonly schoolTypeId: SCHOOL_TYPE_ID;
	public readonly spellEffects: SpellEffectModel[];
	public readonly auras: AuraModel[];

	private _cooldownAnimationDurationInMs: number;
	private _cooldownTimeout?: NodeJS.Timeout;
	private _notify: () => void;

	constructor(spellTypeId: SPELL_TYPE_ID, notify: () => void) {
		const config = cloneDeep(spellData[spellTypeId]);

		this.spellId = uuidv4();
		this.spellTypeId = spellTypeId;
		this.title = config.title;
		this.description = config.description;
		this.castTimeDurationInMs = config.castTimeDurationInMs;
		this.cooldownDurationInMs =
			config.cooldownDurationInMs > config.globalCooldownDurationInMs
				? config.cooldownDurationInMs
				: config.globalCooldownDurationInMs;
		this.globalCooldownDurationInMs = config.globalCooldownDurationInMs;
		this.schoolTypeId = config.schoolTypeId;
		this.spellEffects = config.spellEffects;
		this.auras = config.auras;

		this._cooldownAnimationDurationInMs = this.cooldownDurationInMs;
		this._notify = notify;
	}

	public stopCooldown(): void {
		if (!this._cooldownTimeout) {
			return;
		}

		clearTimeout(this._cooldownTimeout);
		this._cooldownTimeout = undefined;

		this._notify();
	}

	public startCooldown(): void {
		if (this._cooldownTimeout) {
			return;
		}

		this._cooldownAnimationDurationInMs = this.cooldownDurationInMs;

		this._cooldownTimeout = setTimeout(() => {
			this._cooldownTimeout = undefined;
			this._notify();
		}, this.cooldownDurationInMs);

		this._notify();
	}

	public startGlobalCooldown(): void {
		if (this._cooldownTimeout) {
			return;
		}

		this._cooldownAnimationDurationInMs = this.globalCooldownDurationInMs;

		this._cooldownTimeout = setTimeout(() => {
			this._cooldownTimeout = undefined;
			this._notify();
		}, this.globalCooldownDurationInMs);

		this._notify();
	}

	private _getCastTimeDescription() {
		const castTimeInSeconds = this.castTimeDurationInMs / 1000;
		if (castTimeInSeconds === 0) {
			return 'Instant';
		}

		return `${castTimeInSeconds} sec cast`;
	}

	private _getEffectText() {
		const spellEffectDescriptions = this.spellEffects.map((se) => `SE: ${se.value}.`);
		const auraEffectDescriptions = this.auras.map((ae) => {
			const periodicDescs = ae.periodicEffects.map((pe) => `PE: ${pe.value}.`);
			const modifierDescs = ae.modifyStatEffects.map((mse) => `MSE: ${mse.value}.`);
			return [...periodicDescs, ...modifierDescs];
		});
		return [...spellEffectDescriptions, ...auraEffectDescriptions].join(' ');
	}

	public getState(): SpellState {
		return {
			spellId: this.spellId,
			spellTypeId: this.spellTypeId,
			title: this.title,
			description: this.description,
			effects: this._getEffectText(),
			castTimeDurationInMs: this.castTimeDurationInMs,
			castTimeDescription: this._getCastTimeDescription(),
			cooldownDurationInMs: this._cooldownAnimationDurationInMs,
			cooldownDescription: `${this._cooldownAnimationDurationInMs / 1000} sec`,
			isOnCooldown: !!this._cooldownTimeout,
		};
	}
}
