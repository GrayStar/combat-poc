import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { format } from 'date-fns';
import { BATTLE_TYPE_ID, battleData } from '@/lib/battle/battle-data';
import { CharacterState } from '@/lib/character/character-class';
import { CHARACTER_TYPE_ID } from '@/lib/character/character-data';
import { CombatLogEntry } from '@/lib/battle/battle-models';
import { CharacterPlayer } from '@/lib/character/character-player';
import { CharacterNonPlayer } from '@/lib/character/character-non-player';

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

export class Battle {
	public readonly battleId: string;
	public readonly battleTypeId: BATTLE_TYPE_ID;
	public readonly title: string;

	private _playerCharacterId: string = '';
	private _friendlyNonPlayerCharacterIds: string[] = [];
	private _hostileNonPlayerCharacterIds: string[] = [];
	private _characters: Record<string, CharacterPlayer | CharacterNonPlayer> = {};
	private _notificationSubscribers = new Set<(state: BattleState) => void>();
	private _combatLog: CombatLogEntry[] = [];

	constructor(battleTypeId: BATTLE_TYPE_ID) {
		const config = cloneDeep(battleData[battleTypeId]);
		this.battleId = uuidv4();
		this.battleTypeId = battleTypeId;
		this.title = config.title;

		this.initializeCharacters(config);
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

	// public get statusEffects() {
	// 	return this._statusEffects;
	// }

	public get subscribe() {
		return this._subscribe.bind(this);
	}

	public getState(): BattleState {
		const characterStates: Record<string, CharacterState> = {};

		for (const [id, instance] of Object.entries(this._characters)) {
			characterStates[id] = instance.getState();
		}

		return {
			battleId: this.battleId,
			battleTypeId: this.battleTypeId,
			title: this.title,
			playerCharacterId: this.playerCharacterId,
			friendlyNonPlayerCharacterIds: this.friendlyNonPlayerCharacterIds,
			hostileNonPlayerCharacterIds: this.hostileNonPlayerCharacterIds,
			characters: characterStates,
			combatLog: [...this._combatLog],
		};
	}

	private handleCombatLogMessage(message: string) {
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

	public async handleCastSpell(data: { casterId: string; targetId: string; spellId: string }) {
		const { casterId, targetId, spellId } = data;
		const caster = this._characters[casterId];
		const target = this._characters[targetId];

		try {
			const spellPayload = await caster.castSpell(spellId);
			target.recieveSpellPayload(spellPayload, (message: string) => {
				this.handleCombatLogMessage(message);
			});
		} catch (error) {
			if (error instanceof Error) {
				this.handleCombatLogMessage(error.message);
			}
		}
	}

	public handleAbortCastSpell(data: { casterId: string }) {
		const { casterId } = data;
		const character = this._characters[casterId];
		character.interuptCasting();
	}

	private _subscribe(callback: (state: BattleState) => void): () => void {
		this._notificationSubscribers.add(callback);
		callback(this.getState());
		return () => {
			this._notificationSubscribers.delete(callback);
		};
	}

	private initializeCharacters(config: (typeof battleData)[BATTLE_TYPE_ID]): void {
		const player = new CharacterPlayer(config.playerCharacterTypeId, this.notify.bind(this));
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

	private createCharacterRecord(ids: CHARACTER_TYPE_ID[]): Record<string, CharacterNonPlayer> {
		return ids.reduce((acc, id) => {
			const character = new CharacterNonPlayer(id, this.notify.bind(this), this.handleCastSpell.bind(this));
			acc[character.characterId] = character;
			return acc;
		}, {} as Record<string, CharacterNonPlayer>);
	}
}
