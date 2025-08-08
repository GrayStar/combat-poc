import { SpellEffectSummonModel } from '@/lib/spell/spell-models';
import { SpellEffect } from '@/lib/spell/spell-effects/spell-effect';
import { CHARACTER_TYPE_ID } from '@/lib/data/enums';
import { Character } from '@/lib/character/character-class';

export class SpellEffectSummon extends SpellEffect {
	private readonly _value: number;
	private readonly _characterTypeId: CHARACTER_TYPE_ID;

	constructor(config: SpellEffectSummonModel, character: Character, casterId: string) {
		super(character, casterId);

		this._value = config.value;
		this._characterTypeId = config.characterTypeId;

		this._handleEffect();
		this._combatLogEntry();
	}

	protected override _handleEffect() {
		for (let i = 0; i < this._value; i++) {
			this._addSummon(this._characterTypeId);
		}
	}

	private _addSummon(characterTypeId: CHARACTER_TYPE_ID) {
		const owner = this._character.battle.characters[this._character.characterId];
		const battle = this._character.battle;

		const ownerIsFriendly =
			battle.friendlyNonPlayerCharacterIds.includes(owner.characterId) ||
			battle.playerCharacterId === owner.characterId;
		const ownerIsHostile = battle.hostileNonPlayerCharacterIds.includes(owner.characterId);

		if (!ownerIsFriendly && !ownerIsHostile) {
			throw new Error('no owner found.');
		}

		let summonId: string;
		if (ownerIsFriendly) {
			summonId = battle.addFriendlyCharacter(characterTypeId);
		} else {
			summonId = battle.addHostileCharacter(characterTypeId);
		}

		const summon = battle.characters[summonId];
		const ownerHasThreat = Object.keys(owner.threat).length > 0;

		if (ownerHasThreat) {
			summon.setThreat(owner.threat);
			return;
		}

		const threatCandidateIds = ownerIsFriendly
			? battle.hostileNonPlayerCharacterIds
			: [...battle.friendlyNonPlayerCharacterIds, battle.playerCharacterId];
		const randomTargetId = threatCandidateIds[Math.floor(Math.random() * threatCandidateIds.length)];

		summon.adjustThreat(randomTargetId, 100);
	}

	protected override _combatLogEntry() {
		const plural = this._value !== 1;

		this._character.battle.addCombatLogMessage(
			`${this._character.title} summoned ${this._value} ${this._characterTypeId}${plural ? 's' : ''}.`
		);
	}
}
