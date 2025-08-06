import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { SPELL_TYPE_ID, spellData } from '@/lib/spell/spell-data';
import {
	AuraModel,
	MODIFY_TYPE_ID,
	PERIODIC_EFFECT_TYPE_ID,
	SCHOOL_TYPE_ID,
	SpellEffectDamageModel,
	SpellEffectDispelModel,
	SpellEffectHealModel,
	SpellEffectValueModifier,
	SpellPayload,
} from '@/lib/spell/spell-models';
import { Character } from '@/lib/character/character-class';

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

	private readonly _damageEffects: SpellEffectDamageModel[];
	private readonly _healEffects: SpellEffectHealModel[];
	private readonly _dispelEffects: SpellEffectDispelModel[];
	private readonly _auras: AuraModel[];
	private readonly _character;

	private _cooldownAnimationDurationInMs: number;
	private _cooldownTimeout?: NodeJS.Timeout;
	private _notify: () => void;

	constructor(spellTypeId: SPELL_TYPE_ID, character: Character, notify: () => void) {
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
		this._damageEffects = config.damageEffects;
		this._healEffects = config.healEffects;
		this._dispelEffects = config.dispelEffects;
		this._auras = config.auras;

		this._character = character;
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

	private _getProcessedDamageEffects(): SpellEffectDamageModel[] {
		return this._damageEffects.map((effect) => ({
			...effect,
			value: this._getCharacterStatsProcessedValue(effect.value, effect.valueModifiers),
		}));
	}

	private _getProcessedHealEffects(): SpellEffectHealModel[] {
		return this._healEffects.map((effect) => ({
			...effect,
			value: this._getCharacterStatsProcessedValue(effect.value, effect.valueModifiers),
		}));
	}

	private _getProcessedAuras(): AuraModel[] {
		return this._auras.map((a) => ({
			...a,
			periodicEffects: a.periodicEffects.map((effect) => {
				const tickCount = a.durationInMs / effect.intervalInMs;
				const totalValue = tickCount * effect.value;
				const processedTotalValue = this._getCharacterStatsProcessedValue(totalValue, effect.valueModifiers);
				const processedTickValue = processedTotalValue / tickCount;

				return {
					...effect,
					value: processedTickValue,
				};
			}),
		}));
	}

	private _getCharacterStatsProcessedValue(value: number, valueModifiers: SpellEffectValueModifier[]): number {
		return valueModifiers.reduce<number>(
			(currentValue, valueModifier) =>
				currentValue + this._character.stats[valueModifier.stat] * valueModifier.coefficient,
			value
		);
	}

	private _getCastTimeDescription() {
		const castTimeInSeconds = this.castTimeDurationInMs / 1000;
		if (castTimeInSeconds === 0) {
			return 'Instant';
		}

		return `${castTimeInSeconds} sec cast`;
	}

	private _getDamageEffectDescriptions() {
		return this._getProcessedDamageEffects().map(
			(effect) => `Deals ${effect.value} ${effect.schoolTypeId} damage.`
		);
	}

	private _getHealEffectDescriptions() {
		return this._getProcessedHealEffects().map((effect) => `Heals ${effect.value} health.`);
	}

	private _getDispelEffectDescriptions() {
		return this._dispelEffects.map((effect) => `Removes ${effect.value} ${effect.dispelTypeId} effect.`);
	}

	private _getAuraDescriptions() {
		return this._getProcessedAuras().flatMap((a) => {
			const durationInSeconds = a.durationInMs / 1000;

			const statEffectDescriptions = a.modifyStatEffects.map((effect) => {
				const direction = effect.modifyTypeId === MODIFY_TYPE_ID.INCREASE ? 'Increases' : 'Decreases';
				return `${direction} ${effect.statTypeId} by ${effect.value} for ${durationInSeconds} seconds.`;
			});

			const periodicEffectDescriptions = a.periodicEffects.map((effect) => {
				const intervalInSeconds = effect.intervalInMs / 1000;
				const initial =
					effect.periodicEffectTypeId === PERIODIC_EFFECT_TYPE_ID.DAMAGE
						? `Deals ${effect.value} ${effect.schoolTypeId} damage`
						: `Heals ${effect.value} health`;
				return `${initial} every ${intervalInSeconds} seconds for ${durationInSeconds} seconds.`;
			});

			return [...statEffectDescriptions, ...periodicEffectDescriptions];
		});
	}

	private _getEffectDescriptions() {
		return [
			...this._getDamageEffectDescriptions(),
			...this._getHealEffectDescriptions(),
			...this._getDispelEffectDescriptions(),
			...this._getAuraDescriptions(),
		]
			.filter(Boolean)
			.join('\n');
	}

	public getPayload(): SpellPayload {
		return {
			casterId: this._character.characterId,
			title: this.title,
			spellTypeId: this.spellTypeId,
			schoolTypeId: this.schoolTypeId,
			damageEffects: this._getProcessedDamageEffects(),
			healEffects: this._getProcessedHealEffects(),
			dispelEffects: this._dispelEffects,
			auras: this._getProcessedAuras(),
		};
	}

	public getState(): SpellState {
		return {
			spellId: this.spellId,
			spellTypeId: this.spellTypeId,
			title: this.title,
			description: this.description,
			effects: this._getEffectDescriptions(),
			castTimeDurationInMs: this.castTimeDurationInMs,
			castTimeDescription: this._getCastTimeDescription(),
			cooldownDurationInMs: this._cooldownAnimationDurationInMs,
			cooldownDescription: `${this._cooldownAnimationDurationInMs / 1000} sec`,
			isOnCooldown: !!this._cooldownTimeout,
		};
	}
}
