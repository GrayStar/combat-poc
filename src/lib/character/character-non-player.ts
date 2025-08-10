import { Character } from '@/lib/character/character-class';
import { RESOURCE_TYPE_ID } from '@/lib/spell/spell-models';
import { CHARACTER_TYPE_ID } from '@/lib/data/enums';
import { Battle } from '@/lib/battle/battle-class';
import { getRandomInt } from '@/lib/utils/number-utils';

export class CharacterNonPlayer extends Character {
	private _actionInterval?: ReturnType<typeof setInterval>;
	private _actionIntervalInMs: number = 1000;

	constructor(characterTypeId: CHARACTER_TYPE_ID, battle: Battle, summonedBySpellId?: string) {
		super(characterTypeId, battle);
		this._summonedBySpellId = summonedBySpellId;
	}

	protected override _determineTarget() {
		const threatEntries = Object.entries(this._threat);

		if (threatEntries.length <= 0) {
			this._targetCharacterId = '';
			this._stopActionInterval();
			return;
		}

		let [maxCharacterId, maxThreat] = threatEntries[0];

		for (const [currentCharacterId, currentThreat] of threatEntries) {
			if (currentThreat > maxThreat) {
				maxThreat = currentThreat;
				maxCharacterId = currentCharacterId;
			}
		}

		this._targetCharacterId = maxCharacterId;

		if (this._targetCharacterId) {
			this._startActionInterval();
		}
	}

	private _determineSpellToCast() {
		if (this._currentCast) {
			return;
		}

		const offCooldownSpells = this.spells.filter((s) => !s.isOnCooldown);
		if (offCooldownSpells.length <= 0) {
			return;
		}

		const affordableSpells = offCooldownSpells.filter((s) => {
			const check = s.cost.map((resourceCost) => {
				if (resourceCost.resourceTypeId === RESOURCE_TYPE_ID.MANA) {
					return resourceCost.amountFlat <= this.mana;
				}
				if (resourceCost.resourceTypeId === RESOURCE_TYPE_ID.HEALTH) {
					return resourceCost.amountFlat <= this.health;
				}
				return true;
			});
			return check.every((c) => c);
		});

		if (affordableSpells.length <= 0) {
			return;
		}

		const randomSpell = affordableSpells[getRandomInt(0, affordableSpells.length - 1)];

		if (!this._targetCharacterId) {
			return;
		}

		this.castSpell(randomSpell.spellId, this._targetCharacterId);
	}

	private _startActionInterval() {
		if (this._actionInterval) {
			return;
		}

		this._actionInterval = setInterval(() => {
			this._determineSpellToCast();
		}, this._actionIntervalInMs);
	}

	private _stopActionInterval() {
		if (!this._actionInterval) {
			return;
		}

		clearInterval(this._actionInterval);
		this._actionInterval = undefined;
	}

	protected override _dieTriggerSideEffects() {
		this._targetCharacterId = '';
		this._stopActionInterval();
	}
}
