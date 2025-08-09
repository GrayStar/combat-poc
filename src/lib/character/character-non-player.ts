import { Character } from '@/lib/character/character-class';
import { RESOURCE_TYPE_ID } from '../spell/spell-models';
import { CHARACTER_TYPE_ID } from '@/lib/data/enums';
import { Battle } from '@/lib/battle/battle-class';
import { getRandomInt } from '../utils/number-utils';

export class CharacterNonPlayer extends Character {
	private _inCombat: boolean;

	constructor(characterTypeId: CHARACTER_TYPE_ID, battle: Battle, summonedBySpellId?: string) {
		super(characterTypeId, battle);
		this._summonedBySpellId = summonedBySpellId;
		this._inCombat = false;
	}

	protected override _determineTarget() {
		const threatEntries = Object.entries(this._threat);

		if (threatEntries.length <= 0) {
			this._targetCharacterId = '';
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
		this.determineNextAction();
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
			this._determineTarget();
			return;
		}

		this.castSpell(randomSpell.spellId, this._targetCharacterId);
	}

	protected override _dieTriggerSideEffects() {
		this._inCombat = false;
		this._targetCharacterId = '';
	}

	public override determineNextAction(): void {
		this._inCombat = true;
		this._determineSpellToCast();
	}

	protected override _recieveSpellSideEffects(): void {
		if (this._inCombat) {
			return;
		}

		this.determineNextAction();
	}
}
