import { DISPEL_TYPE_ID, SpellEffectDispelModel } from '@/lib/spell/spell-models';
import { SpellEffect } from '@/lib/spell/spell-effects/spell-effect';
import { Character } from '@/lib/character/character-class';

export class SpellEffectDispel extends SpellEffect {
	private readonly _dispelTypeId: DISPEL_TYPE_ID;
	private readonly _value: number;

	private _amountOfDispels: number = 0;

	constructor(config: SpellEffectDispelModel, character: Character, casterId: string) {
		super(character, casterId);

		this._dispelTypeId = config.dispelTypeId;
		this._value = config.value;

		this._handleEffect();
		this._combatLogEntry();
	}

	protected override _handleEffect() {
		const auraStates = Object.values(this._character.getAuraStates());
		const removalCandidatesAuraIds = auraStates
			.filter(({ dispelTypeId }) => dispelTypeId === this._dispelTypeId)
			.map(({ auraId }) => auraId);

		if (removalCandidatesAuraIds.length === 0) {
			return;
		}

		const removalCount = Math.min(this._value, removalCandidatesAuraIds.length);
		this._amountOfDispels = removalCount;

		for (let i = removalCandidatesAuraIds.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[removalCandidatesAuraIds[i], removalCandidatesAuraIds[j]] = [
				removalCandidatesAuraIds[j],
				removalCandidatesAuraIds[i],
			];
		}

		removalCandidatesAuraIds.slice(0, removalCount).forEach((auraId) => {
			this._character.removeAuraByAuraId(auraId);
		});
	}

	protected override _combatLogEntry() {
		const plural = this._amountOfDispels !== 1;

		this._character.battle.addCombatLogMessage(
			`${this._character.title} had ${this._amountOfDispels} ${this._dispelTypeId} effect${
				plural ? 's' : ''
			} dispeled.`
		);
	}
}
