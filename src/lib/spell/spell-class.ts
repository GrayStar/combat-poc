import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { SPELL_TYPE_ID, spellData } from '@/lib/spell/spell-data';
import {
	AuraModel,
	MODIFY_TYPE_ID,
	PERIODIC_EFFECT_TYPE_ID,
	SCHOOL_TYPE_ID,
	SpellCostModel,
	SpellEffectDamageModel,
	SpellEffectDispelModel,
	SpellEffectHealModel,
	SpellEffectInterruptModel,
	SpellEffectSummonModel,
	SpellEffectValueModifier,
	SpellPayload,
} from '@/lib/spell/spell-models';
import { Character } from '@/lib/character/character-class';
import { SECONDARY_STAT_TYPE_ID } from '../character/character-models';
import { roundNumber } from '@/lib/utils/number-utils';

export type SpellState = {
	spellId: string;
	title: string;
	costDescription: string;
	description: string;
	spellEffectDescription: string;
	castTimeDescription: string;
	cooldownDescription: string;
	castTimeAnimationDurationInMs: number;
	cooldownAnimationDurationInMs: number;
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

	private readonly _cost: SpellCostModel[];
	private readonly _damageEffects: SpellEffectDamageModel[];
	private readonly _healEffects: SpellEffectHealModel[];
	private readonly _dispelEffects: SpellEffectDispelModel[];
	private readonly _interruptEffects: SpellEffectInterruptModel[];
	private readonly _summonEffects: SpellEffectSummonModel[];
	private readonly _auras: AuraModel[];
	private readonly _character;

	private _cooldownAnimationDurationInMs: number;
	private _cooldownTimeout?: NodeJS.Timeout;

	constructor(spellTypeId: SPELL_TYPE_ID, character: Character) {
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

		this._cost = config.cost;
		this._damageEffects = config.damageEffects;
		this._healEffects = config.healEffects;
		this._dispelEffects = config.dispelEffects;
		this._interruptEffects = config.interruptEffects;
		this._summonEffects = config.summonEffects;
		this._auras = config.auras;

		this._character = character;
		this._cooldownAnimationDurationInMs = this.cooldownDurationInMs;
	}

	public get isOnCooldown() {
		return !!this._cooldownTimeout;
	}
	public get cost() {
		return this._cost;
	}

	public stopCooldown(): void {
		if (!this._cooldownTimeout) {
			return;
		}

		clearTimeout(this._cooldownTimeout);
		this._cooldownTimeout = undefined;

		this._character.battle.notify();
	}

	public startCooldown(): void {
		if (this._cooldownTimeout) {
			return;
		}

		this._cooldownAnimationDurationInMs = this._getProcessedCooldownDurationInMs();

		this._cooldownTimeout = setTimeout(() => {
			this._cooldownTimeout = undefined;
			this._character.battle.notify();
		}, this._getProcessedCooldownDurationInMs());

		this._character.battle.notify();
	}

	public startGlobalCooldown(): void {
		if (this._cooldownTimeout) {
			return;
		}

		this._cooldownAnimationDurationInMs = this._getProcessedGlobalCooldownDurationInMs();

		this._cooldownTimeout = setTimeout(() => {
			this._cooldownTimeout = undefined;
			this._character.battle.notify();
		}, this._getProcessedGlobalCooldownDurationInMs());

		this._character.battle.notify();
	}

	private _getProcessedCastTimeDurationInMs(): number {
		return roundNumber(this.castTimeDurationInMs / (1 + this._character.stats[SECONDARY_STAT_TYPE_ID.HASTE]));
	}

	private _getProcessedCooldownDurationInMs(): number {
		return roundNumber(this.cooldownDurationInMs / (1 + this._character.stats[SECONDARY_STAT_TYPE_ID.HASTE]));
	}

	private _getProcessedGlobalCooldownDurationInMs(): number {
		return roundNumber(this.globalCooldownDurationInMs / (1 + this._character.stats[SECONDARY_STAT_TYPE_ID.HASTE]));
	}

	private _getProcessedCost(): SpellCostModel[] {
		return this._cost;
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
				roundNumber(currentValue + this._character.stats[valueModifier.stat] * valueModifier.coefficient),
			value
		);
	}

	private _getCostDescription() {
		return this._getProcessedCost()
			.map((c) => {
				return `${c.amountFlat} ${c.resourceTypeId}`;
			})
			.filter(Boolean)
			.join('\n');
	}

	private _getCastTimeDescription() {
		const castTimeInSeconds = roundNumber(this._getProcessedCastTimeDurationInMs() / 1000);
		if (castTimeInSeconds === 0) {
			return 'Instant';
		}

		return `${castTimeInSeconds} sec cast`;
	}

	private _getCooldownDescription() {
		const cooldownInSeconds = roundNumber(this._getProcessedCooldownDurationInMs() / 1000);
		if (cooldownInSeconds === 0) {
			return 'Instant';
		}

		return `${cooldownInSeconds} sec cooldown`;
	}

	private _getDamageEffectDescriptions() {
		return this._getProcessedDamageEffects().map(
			(effect) => `Deals ${effect.value} ${effect.schoolTypeId} damage.`
		);
	}

	private _getHealEffectDescriptions() {
		return this._getProcessedHealEffects().map((effect) => `Heal the target for ${effect.value}.`);
	}

	private _getDispelEffectDescriptions() {
		return this._dispelEffects.map(
			(effect) =>
				`Dispells ${effect.dispelTypeId} from the target, removing ${effect.value} effect${
					effect.value === 1 ? '' : 's'
				} at random.`
		);
	}

	private _getInterruptEffectDescriptions() {
		return this._interruptEffects.map(() => `Interrupts spell casting.`);
	}

	private _getSummonEffectDescriptions() {
		return this._summonEffects.map(
			(effect) =>
				`Summons ${effect.value} ${effect.characterTypeId}${
					effect.value === 1 ? '' : 's'
				}, loyal to the target.`
		);
	}

	private _getAuraDescriptions() {
		return this._getProcessedAuras().flatMap((a) => {
			const durationInSeconds = roundNumber(a.durationInMs / 1000);

			const statEffectDescriptions = a.modifyStatEffects.map((effect) => {
				const direction = effect.modifyTypeId === MODIFY_TYPE_ID.INCREASE ? 'Increases' : 'Decreases';
				return `${direction} ${effect.statTypeId} by ${effect.value} for ${durationInSeconds} seconds.`;
			});

			const periodicEffectDescriptions = a.periodicEffects.map((effect) => {
				const intervalInSeconds = roundNumber(effect.intervalInMs / 1000);
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
			...this._getInterruptEffectDescriptions(),
			...this._getSummonEffectDescriptions(),
		]
			.filter(Boolean)
			.join('\n');
	}

	public getPayload(): SpellPayload {
		return {
			spellId: this.spellId,
			casterId: this._character.characterId,
			title: this.title,
			spellTypeId: this.spellTypeId,
			schoolTypeId: this.schoolTypeId,
			cost: this._getProcessedCost(),
			damageEffects: this._getProcessedDamageEffects(),
			healEffects: this._getProcessedHealEffects(),
			dispelEffects: this._dispelEffects,
			interruptEffects: this._interruptEffects,
			summonEffects: this._summonEffects,
			auras: this._getProcessedAuras(),
			castTimeDurationInMs: this._getProcessedCastTimeDurationInMs(),
		};
	}

	public getState(): SpellState {
		return {
			spellId: this.spellId,
			title: this.title,
			costDescription: this._getCostDescription(),
			castTimeDescription: this._getCastTimeDescription(),
			cooldownDescription: this._getCooldownDescription(),
			description: this.description,
			spellEffectDescription: this._getEffectDescriptions(),
			castTimeAnimationDurationInMs: this._getProcessedCastTimeDurationInMs(),
			cooldownAnimationDurationInMs: this._cooldownAnimationDurationInMs,
			isOnCooldown: this.isOnCooldown,
		};
	}
}
