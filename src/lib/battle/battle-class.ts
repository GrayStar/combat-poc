import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { format } from 'date-fns';
import { BATTLE_TYPE_ID, battleData } from '@/lib/battle/battle-data';
import { CharacterState } from '@/lib/character/character-class';
import { BattleModel, CombatLogEntry } from '@/lib/battle/battle-models';
import { CharacterPlayer } from '@/lib/character/character-player';
import { CharacterNonPlayer } from '@/lib/character/character-non-player';
import { CHARACTER_TYPE_ID } from '@/lib/data/enums';

export type BattleState = {
	battleId: string;
	battleTypeId: BATTLE_TYPE_ID;
	title: string;
	playerCharacterId: string;
	friendlyNonPlayerCharacterIds: string[];
	hostileNonPlayerCharacterIds: string[];
	characters: Record<string, CharacterState>;
	combatLog: CombatLogEntry[];
};

export type BattleHandleSpellCastData = {
	casterId: string;
	targetId: string;
	spellId: string;
};

export class Battle {
	private readonly _battleId: string;
	private readonly _battleTypeId: BATTLE_TYPE_ID;
	private readonly _title: string;

	private _playerCharacterId: string = '';
	private _friendlyNonPlayerCharacterIds: string[] = [];
	private _hostileNonPlayerCharacterIds: string[] = [];
	private _characters: Record<string, CharacterPlayer | CharacterNonPlayer> = {};
	private _notificationSubscribers = new Set<(state: BattleState) => void>();
	private _combatLog: CombatLogEntry[] = [];

	constructor(battleTypeId: BATTLE_TYPE_ID) {
		const config = cloneDeep(battleData[battleTypeId]);
		this._battleId = uuidv4();
		this._battleTypeId = battleTypeId;
		this._title = config.title;

		this._initializeCharacters(config);
	}

	public get playerCharacterId() {
		return this._playerCharacterId;
	}

	public get friendlyNonPlayerCharacterIds() {
		return this._friendlyNonPlayerCharacterIds;
	}

	public get hostileNonPlayerCharacterIds() {
		return this._hostileNonPlayerCharacterIds;
	}

	public get characters() {
		return this._characters;
	}

	public get battleId() {
		return this._battleId;
	}

	public get subscribe() {
		return this._subscribe.bind(this);
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

	public async handleCastSpell(data: BattleHandleSpellCastData) {
		const { casterId, targetId, spellId } = data;
		const caster = this._characters[casterId];
		const target = this._characters[targetId];

		try {
			const spellPayload = await caster.castSpell(spellId);
			target.recieveSpellPayload(spellPayload);
		} catch (error) {
			if (error instanceof Error) {
				this.addCombatLogMessage(error.message);
			}
		}
	}

	public abortCastSpell(characterId: string) {
		const character = this._characters[characterId];
		character.interuptCasting();
	}

	public addFriendlyCharacter(characterTypeId: CHARACTER_TYPE_ID, summonedBySpellId?: string) {
		const character = new CharacterNonPlayer(characterTypeId, this, summonedBySpellId);
		this._friendlyNonPlayerCharacterIds.push(character.characterId);
		this._characters[character.characterId] = character;
		return character.characterId;
	}

	public addHostileCharacter(characterTypeId: CHARACTER_TYPE_ID, summonedBySpellId?: string) {
		const character = new CharacterNonPlayer(characterTypeId, this, summonedBySpellId);
		this._hostileNonPlayerCharacterIds.push(character.characterId);
		this._characters[character.characterId] = character;
		return character.characterId;
	}

	public removeCharacterByCharacterId(characterId: string) {
		const friendlyIndex = this._friendlyNonPlayerCharacterIds.indexOf(characterId);
		if (friendlyIndex !== -1) {
			this._friendlyNonPlayerCharacterIds.splice(friendlyIndex, 1);
		}

		const hostileIndex = this._hostileNonPlayerCharacterIds.indexOf(characterId);
		if (hostileIndex !== -1) {
			this._hostileNonPlayerCharacterIds.splice(hostileIndex, 1);
		}

		delete this._characters[characterId];

		Object.values(this._characters).forEach((c) => {
			if (c.targetCharacterId === characterId) {
				c.interuptCasting();
			}

			c.removeThreat(characterId);
		});
	}

	public addCombatLogMessage(message: string) {
		const date = new Date();

		this._combatLog = [
			...this._combatLog,
			{
				combatLogEntryId: uuidv4(),
				time: date.getTime().toString(),
				timeDescription: format(date, 'hh:mm:ss aaa'),
				message,
			},
		];

		this.notify();
	}

	public getState(): BattleState {
		const characterStates: Record<string, CharacterState> = {};

		for (const [id, instance] of Object.entries(this._characters)) {
			characterStates[id] = instance.getState();
		}

		return {
			battleId: this._battleId,
			battleTypeId: this._battleTypeId,
			title: this._title,
			playerCharacterId: this._playerCharacterId,
			friendlyNonPlayerCharacterIds: [...this._friendlyNonPlayerCharacterIds],
			hostileNonPlayerCharacterIds: [...this._hostileNonPlayerCharacterIds],
			characters: characterStates,
			combatLog: [...this._combatLog],
		};
	}

	private _subscribe(callback: (state: BattleState) => void): () => void {
		this._notificationSubscribers.add(callback);
		callback(this.getState());
		return () => {
			this._notificationSubscribers.delete(callback);
		};
	}

	private _initializeCharacters(config: BattleModel): void {
		const player = new CharacterPlayer(config.playerCharacterTypeId, this);
		const friendly = this._createCharacterRecord(config.friendlyNonPlayerCharacterTypeIds);
		const hostile = this._createCharacterRecord(config.hostileNonPlayerCharacterTypeIds);

		this._playerCharacterId = player.characterId;
		this._friendlyNonPlayerCharacterIds = Object.keys(friendly);
		this._hostileNonPlayerCharacterIds = Object.keys(hostile);

		this._characters = {
			[player.characterId]: player,
			...friendly,
			...hostile,
		};
	}

	private _createCharacterRecord(ids: CHARACTER_TYPE_ID[]): Record<string, CharacterNonPlayer> {
		return ids.reduce<Record<string, CharacterNonPlayer>>((acc, id) => {
			const character = new CharacterNonPlayer(id, this);
			acc[character.characterId] = character;
			return acc;
		}, {});
	}
}
