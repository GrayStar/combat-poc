import { v4 as uuidv4 } from 'uuid';
import {
	DISPEL_TYPE_ID,
	MODIFY_TYPE_ID,
	ModifyStatEffectModel,
	PERIODIC_EFFECT_TYPE_ID,
	PeriodicEffectModel,
} from '@/lib/spell/spell-models';
import { SPELL_TYPE_ID } from '@/lib/spell/spell-data';
import { Character } from '@/lib/character/character-class';

import { AuraEffectPeriodicDamage } from '@/lib/spell/aura-effects/aura-effect-periodic-damage';
import { AuraEffectPeriodicHealing } from '@/lib/spell/aura-effects/aura-effect-periodic-healing';
import { AuraEffectModifyStatIncrease } from '@/lib/spell/aura-effects/aura-effect-modify-stat-increase';
import { AuraEffectModifyStatDecrease } from '@/lib/spell/aura-effects/aura-effect-modify-stat-decrease';

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
	casterId: string;
	title: string;
	spellTypeId: SPELL_TYPE_ID;
	durationInMs: number;
	dispelTypeId: DISPEL_TYPE_ID;
	periodicEffects: PeriodicEffectModel[];
	modifyStatEffects: ModifyStatEffectModel[];
};

export class Aura {
	public readonly auraId: string;
	public readonly title: string;
	public readonly spellTypeId: SPELL_TYPE_ID;
	public readonly periodicEffects: (AuraEffectPeriodicDamage | AuraEffectPeriodicHealing)[];
	public readonly modifyStatEffects: (AuraEffectModifyStatIncrease | AuraEffectModifyStatDecrease)[];
	public readonly durationInMs: number;
	public readonly dispelTypeId: DISPEL_TYPE_ID;
	private readonly character: Character;

	private _renderKey: string = '';
	private _timeoutTimer: TimeoutTimer | null = null;

	constructor(config: AuraConfig, character: Character) {
		this.auraId = uuidv4();
		this.title = config.title;
		this.spellTypeId = config.spellTypeId;
		this.durationInMs = config.durationInMs;
		this.dispelTypeId = config.dispelTypeId;
		this.character = character;

		this.periodicEffects = config.periodicEffects.map((cfg) => {
			if (cfg.periodicEffectTypeId === PERIODIC_EFFECT_TYPE_ID.DAMAGE) {
				return new AuraEffectPeriodicDamage(cfg, character, config.casterId);
			} else {
				return new AuraEffectPeriodicHealing(cfg, character, config.casterId);
			}
		});

		this.modifyStatEffects = config.modifyStatEffects.map((cfg) => {
			if (cfg.modifyTypeId === MODIFY_TYPE_ID.INCREASE) {
				return new AuraEffectModifyStatIncrease(cfg, character, config.casterId);
			} else {
				return new AuraEffectModifyStatDecrease(cfg, character, config.casterId);
			}
		});

		this.restartTimers();
	}

	private clearInternalTimers() {
		this.periodicEffects.forEach((a) => a.stopInterval());

		if (this._timeoutTimer) {
			this.modifyStatEffects.forEach((a) => a.revertStat());
			clearTimeout(this._timeoutTimer);
			this._timeoutTimer = null;
		}
	}

	public stopTimers() {
		this.clearInternalTimers();
	}

	public restartTimers() {
		this.clearInternalTimers();

		this.periodicEffects.forEach((a) => a.startInterval());
		this.modifyStatEffects.forEach((a) => a.modifyStat());

		this._timeoutTimer = setTimeout(() => {
			this.clearInternalTimers();
			this.character.removeAuraByAuraId(this.auraId);
		}, this.durationInMs);

		this._renderKey = uuidv4();
	}

	private getDescription(): string {
		return [
			this.periodicEffects.map((ae) => ae.getDescription()),
			this.modifyStatEffects.map((ae) => ae.getDescription()),
		].join(' ');
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
