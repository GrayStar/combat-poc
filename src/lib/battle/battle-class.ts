import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { BATTLE_TYPE_ID, battleData } from '@/lib/battle';
import { Character, CHARACTER_TYPE_ID, CharacterState } from '@/lib/character';
import { Spell, SpellState } from '@/lib/spell';

export type BattleState = {
	battleId: string;
	battleTypeId: BATTLE_TYPE_ID;
	title: string;
	playerCharacterId: string;
	friendlyNonPlayerCharacterIds: string[];
	hostileNonPlayerCharacterIds: string[];
	characters: Record<string, CharacterState>;
	spells: Record<string, SpellState>;
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

	public get subscribe() {
		return this._subscribe.bind(this);
	}

	public getState(): BattleState {
		const characterStates: Record<string, CharacterState> = {};
		const spellStates: Record<string, SpellState> = {};

		for (const [id, instance] of Object.entries(this._characters)) {
			characterStates[id] = instance.getState();
		}

		for (const [id, instance] of Object.entries(this._spells)) {
			spellStates[id] = instance.getState();
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
		const caster = this._characters[casterId];
		const target = this._characters[targetId];
		const spell = this._spells[spellId];

		console.log('handleCastSpell caster', caster);
		console.log('handleCastSpell target', target);
		console.log('handleCastSpell spell', spell);

		this.notify();
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
