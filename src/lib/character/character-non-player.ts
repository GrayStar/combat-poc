import { Character } from '@/lib/character/character-class';
import { RESOURCE_TYPE_ID } from '../spell/spell-models';
import { CHARACTER_TYPE_ID } from '@/lib/data/enums';
import { BattleFunctions, BattleHandleSpellCastData } from '../battle/battle-class';

export class CharacterNonPlayer extends Character {
	private _targetCharacterId: string = '';
	private _triggerCastSpell: (data: BattleHandleSpellCastData) => void;

	private _actionInterval?: NodeJS.Timeout;
	private _actionIntervalInMs: number = 1500;

	constructor(characterTypeId: CHARACTER_TYPE_ID, battleFuctions: BattleFunctions) {
		super(characterTypeId, battleFuctions);
		this._triggerCastSpell = battleFuctions.handleSpellCast;
	}

	protected override _determineTarget() {
		const threatEntries = Object.entries(this._threat);

		if (threatEntries.length <= 0) {
			this._targetCharacterId = '';
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
			this._startActionTimeout();
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

		const randomSpell = affordableSpells[Math.floor(Math.random() * affordableSpells.length)];

		this._triggerCastSpell({
			casterId: this.characterId,
			targetId: this._targetCharacterId,
			spellId: randomSpell.spellId,
		});
	}

	private _startActionTimeout() {
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
