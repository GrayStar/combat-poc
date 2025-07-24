import { v4 as uuidv4 } from 'uuid';

import { BATTLE_IDS, BattleComposite, CHARACTER_TYPE_IDS } from '@/lib/models';
import { battleData } from '@/lib/data';
import { CharacterEntity, CharacterInstance } from '@/ecs/entities';

export type BattleInstance = ReturnType<typeof BattleEntity>;

export function BattleEntity(battleId: BATTLE_IDS) {
	const battleConfig = battleData[battleId];

	const playerCharacter = CharacterEntity(CHARACTER_TYPE_IDS.PLAYER);
	playerCharacter.setSpells(playerCharacter.spellIds);

	const battleComposite: BattleComposite = {
		...battleConfig,
		id: uuidv4(),
		hostileCharacters: battleConfig.enemyTypeIds.reduce((accumulator, currentValue) => {
			const enemy = CharacterEntity(currentValue);
			enemy.setSpells(enemy.spellIds);

			return {
				...accumulator,
				[enemy.id]: enemy,
			};
		}, {} as Record<string, CharacterInstance>),
		friendlyCharacters: { [playerCharacter.id]: playerCharacter },
	};

	return {
		...battleComposite,
	};
}
