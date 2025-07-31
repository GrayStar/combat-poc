import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { BATTLE_TYPE_ID, battleData } from '@/lib/battle/battle-data';
import { Character, CharacterState } from '@/lib/character/character-class';
import { CHARACTER_TYPE_ID } from '@/lib/character/character-data';

export type BattleState = {
	battleId: string;
	battleTypeId: BATTLE_TYPE_ID;
	title: string;
	playerCharacterId: string;
	friendlyNonPlayerCharacterIds: string[];
	hostileNonPlayerCharacterIds: string[];
	characters: Record<string, CharacterState>;
	// statusEffects: Record<string, StatusEffectState>;
};

export class Battle {
	public readonly battleId: string;
	public readonly battleTypeId: BATTLE_TYPE_ID;
	public readonly title: string;

	private _playerCharacterId: string = '';
	private _friendlyNonPlayerCharacterIds: string[] = [];
	private _hostileNonPlayerCharacterIds: string[] = [];
	private _characters: Record<string, Character> = {};
	// private _statusEffects: Record<string, StatusEffect> = {};
	private _notificationSubscribers = new Set<(state: BattleState) => void>();

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
		//const statusEffectStates: Record<string, StatusEffectState> = {};

		for (const [id, instance] of Object.entries(this._characters)) {
			characterStates[id] = instance.getState();
		}

		// for (const [id, instance] of Object.entries(this._statusEffects)) {
		// 	statusEffectStates[id] = instance.getState();
		// }

		return {
			battleId: this.battleId,
			battleTypeId: this.battleTypeId,
			title: this.title,
			playerCharacterId: this.playerCharacterId,
			friendlyNonPlayerCharacterIds: this.friendlyNonPlayerCharacterIds,
			hostileNonPlayerCharacterIds: this.hostileNonPlayerCharacterIds,
			characters: characterStates,
			//statusEffects: statusEffectStates,
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

	public async handleCastSpell(data: { casterId: string; targetId: string; spellId: string }) {
		const { casterId, targetId, spellId } = data;
		const caster = this._characters[casterId];

		try {
			const spellPayload = await caster.castSpell(spellId);
			console.log(`${caster.title} cast spell:`, spellPayload);
		} catch (error) {
			if (error instanceof Error) {
				console.log('error:', error.message);
			}
		}
	}

	public handleAbortCastSpell(data: { casterId: string }) {
		const { casterId } = data;
		const character = this._characters[casterId];
		character.interuptCasting();
	}

	// private applySpellEffectsToTargetByIdFromCasterById(
	// 	spellEffects: SpellEffect[],
	// 	targetId: string,
	// 	casterId: string
	// ): void {
	// 	const caster = this._characters[casterId];
	// 	const target = this._characters[targetId];

	// 	if (!target) {
	// 		return;
	// 	}

	// 	if (spellEffects.length <= 0) {
	// 		return;
	// 	}

	// 	spellEffects.forEach((spellEffect) => {
	// 		switch (spellEffect.spellEffectTypeId) {
	// 			case SPELL_EFFECT_TYPE_ID.APPLY_AURA:
	// 				break;
	// 			case SPELL_EFFECT_TYPE_ID.DISPEL:
	// 				break;
	// 			case SPELL_EFFECT_TYPE_ID.HEAL:
	// 				break;
	// 			case SPELL_EFFECT_TYPE_ID.SCHOOL_DAMAGE:
	// 				break;
	// 		}
	// 	});

	// 	// character.adjustHealth(spellEffect.resources?.health ?? 0);
	// 	// character.adjustMana(spellEffect.resources?.mana ?? 0);
	// 	// spellEffect.statusEffectTypeIdsToAdd?.forEach((statusEffectTypeId) => {
	// 	// 	this.applyStatusEffectTypeIdToCharacterId(statusEffectTypeId, character.characterId);
	// 	// });
	// 	// spellEffect.statusEffectTypeIdsToRemove?.forEach((statusEffectTypeId) => {
	// 	// 	this.removeStatusEffectTypeIdFromCharacterId(statusEffectTypeId, character.characterId);
	// 	// });
	// }

	// private applyStatusEffectTypeIdToCharacterId(statusEffectTypeId: STATUS_EFFECT_TYPE_ID, characterId: string): void {
	// 	const character = this._characters[characterId];
	// 	if (!character) {
	// 		return;
	// 	}

	// 	const newEffect = new StatusEffect(
	// 		statusEffectTypeId,
	// 		this.handleStatusEffectInterval.bind(this),
	// 		this.handleStatusEffectTimeout.bind(this)
	// 	);
	// 	if (newEffect.canStack) {
	// 		newEffect.stacks = 1;
	// 	}

	// 	const matchingId = character.statusEffectIds.find(
	// 		(id) => this._statusEffects[id]?.statusEffectTypeId === statusEffectTypeId
	// 	);

	// 	if (matchingId) {
	// 		const existing = this._statusEffects[matchingId];
	// 		if (newEffect.canStack) {
	// 			newEffect.stacks = existing.stacks + 1;
	// 		}
	// 		existing.stopAllTimers();
	// 		delete this._statusEffects[matchingId];

	// 		character.removeStatusEffectId(matchingId);
	// 	}

	// 	this._statusEffects[newEffect.statusEffectId] = newEffect;
	// 	character.addStatusEffectId(newEffect.statusEffectId);
	// }

	// private handleStatusEffectInterval(statusEffectId: string) {
	// 	const statusEffect = this._statusEffects[statusEffectId];
	// 	if (!statusEffect) {
	// 		return;
	// 	}

	// 	const affectedCharacterIds = Object.entries(this._characters)
	// 		.filter(([, char]) => char.statusEffectIds.includes(statusEffectId))
	// 		.map(([id]) => id);

	// 	for (const characterId of affectedCharacterIds) {
	// 		for (const spellTypeId of statusEffect.intervalSpellTypeIds) {
	// 			const spellInstance = new Spell(spellTypeId, this.notify.bind(this));
	// 			this.applySpellEffectsToChracterById(characterId, spellInstance.targetEffects);
	// 		}
	// 	}

	// 	this.notify();
	// }

	// private handleStatusEffectTimeout(statusEffectId: string) {
	// 	const statusEffect = this._statusEffects[statusEffectId];
	// 	if (!statusEffect) {
	// 		return;
	// 	}

	// 	const affectedCharacterIds = Object.entries(this._characters)
	// 		.filter(([, char]) => char.statusEffectIds.includes(statusEffectId))
	// 		.map(([id]) => id);

	// 	for (const characterId of affectedCharacterIds) {
	// 		for (const spellTypeId of statusEffect.timeoutSpellTypeIds) {
	// 			const spellInstance = new Spell(spellTypeId, this.notify.bind(this));
	// 			this.applySpellEffectsToChracterById(characterId, spellInstance.targetEffects);
	// 		}
	// 	}

	// 	delete this._statusEffects[statusEffectId];
	// 	for (const character of Object.values(this._characters)) {
	// 		character.removeStatusEffectId(statusEffectId);
	// 	}

	// 	this.notify();
	// }

	// private handleStatusEffectCleared(statusEffectId: string) {
	// 	const statusEffect = this._statusEffects[statusEffectId];
	// 	if (!statusEffect) {
	// 		return;
	// 	}

	// 	const affectedCharacterIds = Object.entries(this._characters)
	// 		.filter(([, char]) => char.statusEffectIds.includes(statusEffectId))
	// 		.map(([id]) => id);

	// 	for (const characterId of affectedCharacterIds) {
	// 		for (const spellTypeId of statusEffect.clearedSpellTypeIds) {
	// 			const spellInstance = new Spell(spellTypeId, this.notify.bind(this));
	// 			this.applySpellEffectsToChracterById(characterId, spellInstance.targetEffects);
	// 		}
	// 	}

	// 	statusEffect.stopAllTimers();
	// 	delete this._statusEffects[statusEffectId];
	// 	for (const character of Object.values(this._characters)) {
	// 		character.removeStatusEffectId(statusEffectId);
	// 	}

	// 	this.notify();
	// }

	// public removeStatusEffectTypeIdFromCharacterId(
	// 	statusEffectTypeId: STATUS_EFFECT_TYPE_ID,
	// 	characterId: string
	// ): void {
	// 	const character = this._characters[characterId];
	// 	if (!character) {
	// 		return;
	// 	}

	// 	const statusEffectIdsToRemove = character.statusEffectIds.filter((statusEffectId) => {
	// 		const eff = this._statusEffects[statusEffectId];
	// 		return eff?.statusEffectTypeId === statusEffectTypeId;
	// 	});

	// 	statusEffectIdsToRemove.forEach(this.handleStatusEffectCleared.bind(this));
	// }

	private _subscribe(callback: (state: BattleState) => void): () => void {
		this._notificationSubscribers.add(callback);
		callback(this.getState());
		return () => {
			this._notificationSubscribers.delete(callback);
		};
	}

	private initializeCharacters(config: (typeof battleData)[BATTLE_TYPE_ID]): void {
		const player = new Character(config.playerCharacterTypeId, this.notify.bind(this));
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

	private createCharacterRecord(ids: CHARACTER_TYPE_ID[]): Record<string, Character> {
		return ids.reduce((acc, id) => {
			const character = new Character(id, this.notify.bind(this));
			acc[character.characterId] = character;
			return acc;
		}, {} as Record<string, Character>);
	}
}
