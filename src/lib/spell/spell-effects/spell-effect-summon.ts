import { SpellEffectSummonModel } from '@/lib/spell/spell-models';
import { SpellEffect } from '@/lib/spell/spell-effects/spell-effect';
import { CHARACTER_TYPE_ID } from '@/lib/data/enums';
import { Character } from '@/lib/character/character-class';

export class SpellEffectSummon extends SpellEffect {
	private readonly _value: number;
	private readonly _summonedBySpellId: string;
	private readonly _characterTypeId: CHARACTER_TYPE_ID;

	constructor(config: SpellEffectSummonModel, character: Character, casterId: string, spellId: string) {
		super(character, casterId);

		this._value = config.value;
		this._characterTypeId = config.characterTypeId;
		this._summonedBySpellId = spellId;

		this._removeSummons();
		this._handleEffect();
		this._combatLogEntry();
	}

	protected override _handleEffect() {
		for (let i = 0; i < this._value; i++) {
			this._addSummon(this._characterTypeId);
		}
	}

	private _removeSummons() {
		const { battle } = this._character;
		const charactersSummonedByThisSpellId = Object.values(battle.characters).filter(
			(c) => c.summonedBySpellId === this._summonedBySpellId
		);

		charactersSummonedByThisSpellId.forEach((character) => {
			character.die();
		});
	}

	private _addSummon(characterTypeId: CHARACTER_TYPE_ID) {
		const battle = this._character.battle;
		const owner = battle.characters[this._character.characterId];

		const ownerIsFriendly =
			battle.friendlyNonPlayerCharacterIds.includes(owner.characterId) ||
			battle.playerCharacterId === owner.characterId;
		const ownerIsHostile = battle.hostileNonPlayerCharacterIds.includes(owner.characterId);

		if (!ownerIsFriendly && !ownerIsHostile) {
			throw new Error('no owner found.');
		}

		let summonId: string;
		if (ownerIsFriendly) {
			summonId = battle.addFriendlyCharacter(characterTypeId, this._summonedBySpellId);
		} else {
			summonId = battle.addHostileCharacter(characterTypeId, this._summonedBySpellId);
		}

		const summon = battle.characters[summonId];
		const threatCandidateIds = ownerIsFriendly
			? battle.hostileNonPlayerCharacterIds
			: [...battle.friendlyNonPlayerCharacterIds, battle.playerCharacterId];

		summon.setThreat(
			threatCandidateIds.reduce(
				(acc, curr) => ({
					...acc,
					[curr]: 1,
				}),
				{}
			)
		);
	}

	protected override _combatLogEntry() {
		const plural = this._value !== 1;

		this._character.battle.addCombatLogMessage(
			`${this._character.title} summoned ${this._value} ${this._characterTypeId}${plural ? 's' : ''}.`
		);
	}
}
