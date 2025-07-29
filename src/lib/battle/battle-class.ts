import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { BATTLE_TYPE_ID, battleData } from '@/lib/battle';
import { Character, CHARACTER_TYPE_ID, CharacterState } from '@/lib/character';
import { Spell, SpellEffect, SpellState } from '@/lib/spell';
import { STATUS_EFFECT_TYPE_ID, StatusEffect, StatusEffectState } from '@/lib/status-effect';

export type BattleState = {
	battleId: string;
	battleTypeId: BATTLE_TYPE_ID;
	title: string;
	playerCharacterId: string;
	friendlyNonPlayerCharacterIds: string[];
	hostileNonPlayerCharacterIds: string[];
	characters: Record<string, CharacterState>;
	spells: Record<string, SpellState>;
	statusEffects: Record<string, StatusEffectState>;
};

export class Battle {
	public readonly battleId: string;
	public readonly battleTypeId: BATTLE_TYPE_ID;
	public readonly title: string;

	private _playerCharacterId: string = '';
	private _friendlyNonPlayerCharacterIds: string[] = [];
	private _hostileNonPlayerCharacterIds: string[] = [];
	private _characters: Record<string, Character> = {};
	private _spells: Record<string, Spell> = {};
	private _statusEffects: Record<string, StatusEffect> = {};
	private _notificationSubscribers = new Set<(state: BattleState) => void>();

	constructor(battleTypeId: BATTLE_TYPE_ID) {
		const config = cloneDeep(battleData[battleTypeId]);
		this.battleId = uuidv4();
		this.battleTypeId = battleTypeId;
		this.title = config.title;

		this.initializeCharacters(config);
		this.initializeSpells();
	}

	public get playerCharacterId() {
		return this._playerCharacterId;
	}

	public get friendlyNonPlayerCharacterIds() {
		return [...this._friendlyNonPlayerCharacterIds];
	}

	public get hostileNonPlayerCharacterIds() {
		return [...this._hostileNonPlayerCharacterIds];
	}

	public get characters() {
		return this._characters;
	}

	public get spells() {
		return this._spells;
	}

	public get statusEffects() {
		return this._statusEffects;
	}

	public get subscribe() {
		return this._subscribe.bind(this);
	}

	public getState(): BattleState {
		const characterStates: Record<string, CharacterState> = {};
		const spellStates: Record<string, SpellState> = {};
		const statusEffectStates: Record<string, StatusEffectState> = {};

		for (const [id, instance] of Object.entries(this._characters)) {
			characterStates[id] = instance.getState();
		}

		for (const [id, instance] of Object.entries(this._spells)) {
			spellStates[id] = instance.getState();
		}

		for (const [id, instance] of Object.entries(this._statusEffects)) {
			statusEffectStates[id] = instance.getState();
		}

		return {
			battleId: this.battleId,
			battleTypeId: this.battleTypeId,
			title: this.title,
			playerCharacterId: this.playerCharacterId,
			friendlyNonPlayerCharacterIds: this.friendlyNonPlayerCharacterIds,
			hostileNonPlayerCharacterIds: this.hostileNonPlayerCharacterIds,
			characters: characterStates,
			spells: spellStates,
			statusEffects: statusEffectStates,
		};
	}

	public notify(): void {
		const state = this.getState();
		for (const subscriber of this._notificationSubscribers) {
			try {
				subscriber(state);
			} catch (error) {
				console.error('BattleInstance notification error:', error);
			}
		}
	}

	public handleCastSpell(data: { casterId: string; targetId: string; spellId: string }): void {
		const { casterId, targetId, spellId } = data;
		// spell on action bar is just for cooldowns
		const spellOnActionBar = this._spells[spellId];
		// todo check if caster can even has the required resources to cast.
		// spell to cast needs to run through caster buffs before applying
		// this might just need to be a getState(), but for now make a new instance.
		const spellToCast = new Spell(spellOnActionBar.spellTypeId, this.notify.bind(this));

		this.applySpellEffectsToChracterById(spellToCast, casterId, spellToCast.casterEffects);
		this.applySpellEffectsToChracterById(spellToCast, targetId, spellToCast.targetEffects);

		spellOnActionBar.startCooldown();
		this.notify();
	}

	private applySpellEffectsToChracterById(spell: Spell, characterId: string, spellEffect?: SpellEffect): void {
		const character = this._characters[characterId];

		if (!character) {
			return;
		}

		if (!spellEffect) {
			return;
		}

		character.adjustHealth(spellEffect.resources?.health ?? 0);
		character.adjustMana(spellEffect.resources?.mana ?? 0);
		spellEffect.statusEffectTypeIdsToAdd?.forEach((statusEffectTypeId) => {
			this.applyStatusEffectTypeIdToCharacterId(statusEffectTypeId, character.characterId, spell.spellId);
		});
		spellEffect.statusEffectTypeIdsToRemove?.forEach((statusEffectTypeId) => {
			this.removeStatusEffectTypeIdFromCharacterId(statusEffectTypeId, character.characterId);
		});
	}

	private applyStatusEffectTypeIdToCharacterId(
		statusEffectTypeId: STATUS_EFFECT_TYPE_ID,
		characterId: string,
		causedBySpellId: string
	): void {
		const character = this._characters[characterId];
		if (!character) {
			return;
		}

		const newEffect = new StatusEffect(
			statusEffectTypeId,
			causedBySpellId,
			this.handleStatusEffectInterval.bind(this),
			this.handleStatusEffectTimeout.bind(this)
		);
		if (newEffect.canStack) {
			newEffect.stacks = 1;
		}

		const matchingId = character.statusEffectIds.find(
			(id) => this._statusEffects[id]?.statusEffectTypeId === statusEffectTypeId
		);

		if (matchingId) {
			const existing = this._statusEffects[matchingId];
			if (newEffect.canStack) {
				newEffect.stacks = existing.stacks + 1;
			}
			existing.stopAllTimers();
			delete this._statusEffects[matchingId];

			character.removeStatusEffectId(matchingId);
		}

		this._statusEffects[newEffect.statusEffectId] = newEffect;
		character.addStatusEffectId(newEffect.statusEffectId);
	}

	private handleStatusEffectInterval(statusEffectId: string) {
		const whatToCast = this._statusEffects[statusEffectId].intervalSpellTypeIds;

		// TODO: handle timeout spellIds?
		// this.castSpell()?

		console.log(whatToCast);
		this.notify();
	}

	private handleStatusEffectTimeout(statusEffectId: string) {
		// TODO: handle timeout spellIds
		delete this._statusEffects[statusEffectId];

		for (const character of Object.values(this._characters)) {
			character.removeStatusEffectId(statusEffectId);
		}

		this.notify();
	}

	public removeStatusEffectTypeIdFromCharacterId(
		statusEffectTypeId: STATUS_EFFECT_TYPE_ID,
		characterId: string
	): void {
		const character = this._characters[characterId];
		if (!character) {
			return;
		}

		const statusEffectIdsToRemove = character.statusEffectIds.filter((statusEffectId) => {
			const eff = this._statusEffects[statusEffectId];
			return eff?.statusEffectTypeId === statusEffectTypeId;
		});

		statusEffectIdsToRemove.forEach((statusEffectId) => {
			const statusEffect = this._statusEffects[statusEffectId];
			if (statusEffect) {
				statusEffect.stopAllTimers();
				delete this._statusEffects[statusEffectId];
			}

			character.removeStatusEffectId(statusEffectId);
		});
	}

	private _subscribe(callback: (state: BattleState) => void): () => void {
		this._notificationSubscribers.add(callback);
		callback(this.getState());
		return () => {
			this._notificationSubscribers.delete(callback);
		};
	}

	private initializeCharacters(config: (typeof battleData)[BATTLE_TYPE_ID]): void {
		const player = new Character(config.playerCharacterTypeId);
		const friendly = this.createCharacterRecord(config.friendlyNonPlayerCharacterTypeIds);
		const hostile = this.createCharacterRecord(config.hostileNonPlayerCharacterTypeIds);

		this._playerCharacterId = player.characterId;
		this._friendlyNonPlayerCharacterIds = Object.keys(friendly);
		this._hostileNonPlayerCharacterIds = Object.keys(hostile);

		this._characters = {
			[player.characterId]: player,
			...friendly,
			...hostile,
		};
	}

	private initializeSpells(): void {
		const playerCharacter = this._characters[this._playerCharacterId];
		const playerSpells = this.createSpellsForCharacter(playerCharacter);
		playerCharacter.setSpellIds(Object.keys(playerSpells));

		const friendlySpells = this.createSpellsForMultipleCharacters(this._friendlyNonPlayerCharacterIds);
		const hostileSpells = this.createSpellsForMultipleCharacters(this._hostileNonPlayerCharacterIds);

		this._spells = {
			...playerSpells,
			...friendlySpells,
			...hostileSpells,
		};
	}

	private createCharacterRecord(ids: CHARACTER_TYPE_ID[]): Record<string, Character> {
		return ids.reduce((acc, id) => {
			const character = new Character(id);
			acc[character.characterId] = character;
			return acc;
		}, {} as Record<string, Character>);
	}

	private createSpellsForCharacter(character: Character): Record<string, Spell> {
		return character.spellTypeIds.reduce((acc, spellTypeId) => {
			const spell = new Spell(spellTypeId, this.notify.bind(this));
			acc[spell.spellId] = spell;
			return acc;
		}, {} as Record<string, Spell>);
	}

	private createSpellsForMultipleCharacters(ids: string[]): Record<string, Spell> {
		return ids.reduce((acc, id) => {
			const character = this._characters[id];
			const spells = this.createSpellsForCharacter(character);
			character.setSpellIds(Object.keys(spells));
			return { ...acc, ...spells };
		}, {} as Record<string, Spell>);
	}
}
