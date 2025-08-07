import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { format } from 'date-fns';
import { BATTLE_TYPE_ID, battleData } from '@/lib/battle/battle-data';
import { CharacterState } from '@/lib/character/character-class';
import { CombatLogEntry } from '@/lib/battle/battle-models';
import { CharacterPlayer } from '@/lib/character/character-player';
import { CharacterNonPlayer } from '@/lib/character/character-non-player';
import { CHARACTER_TYPE_ID } from '../data/enums';

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

export type AddSummonPayload = {
	characterTypeId: CHARACTER_TYPE_ID;
	targetId: string;
};

export type BattleFunctions = {
	notify: () => void;
	handleSpellCast: (data: BattleHandleSpellCastData) => void;
	addSummon: (data: AddSummonPayload) => void;
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

	public get battleId() {
		return this._battleId;
	}

	public get subscribe() {
		return this._subscribe.bind(this);
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

	private _handleCombatLogMessage(message: string) {
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
				this._handleCombatLogMessage(message);
			});
		} catch (error) {
			if (error instanceof Error) {
				this._handleCombatLogMessage(error.message);
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

	private _initializeCharacters(config: (typeof battleData)[BATTLE_TYPE_ID]): void {
		const player = new CharacterPlayer(config.playerCharacterTypeId, {
			addSummon: this.addSummon.bind(this),
			notify: this.notify.bind(this),
			handleSpellCast: this.handleCastSpell.bind(this),
		});
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
		return ids.reduce((acc, id) => {
			const character = new CharacterNonPlayer(id, {
				addSummon: this.addSummon.bind(this),
				notify: this.notify.bind(this),
				handleSpellCast: this.handleCastSpell.bind(this),
			});
			acc[character.characterId] = character;
			return acc;
		}, {} as Record<string, CharacterNonPlayer>);
	}

	public addSummon({ characterTypeId, targetId }: AddSummonPayload) {
		const owner = this._characters[targetId];
		const ownerIsFriendly =
			this._friendlyNonPlayerCharacterIds.includes(targetId) || this._playerCharacterId === targetId;
		const ownerIsHostile = this._hostileNonPlayerCharacterIds.includes(targetId);

		if (!ownerIsFriendly && !ownerIsHostile) {
			throw new Error('no owner found.');
		}

		const summon = new CharacterNonPlayer(characterTypeId, {
			addSummon: this.addSummon.bind(this),
			notify: this.notify.bind(this),
			handleSpellCast: this.handleCastSpell.bind(this),
		});

		const ownerHasThreat = Object.keys(owner.threat).length > 0;
		if (ownerHasThreat) {
			summon.setThreat(owner.threat);
		} else {
			const threatCandidateIds = ownerIsFriendly
				? this._hostileNonPlayerCharacterIds
				: this._friendlyNonPlayerCharacterIds;
			const randomTargetId = threatCandidateIds[Math.floor(Math.random() * threatCandidateIds.length)];
			summon.adjustThreat(randomTargetId, 100);
		}

		if (ownerIsFriendly) {
			this._friendlyNonPlayerCharacterIds.push(summon.characterId);
		} else {
			this._hostileNonPlayerCharacterIds.push(summon.characterId);
		}

		this._characters = {
			...this._characters,
			[summon.characterId]: summon,
		};

		this.notify();
	}
}
