import { PropsWithChildren, useState } from 'react';
import { BattleModel, SPELL_IDS } from '@/lib/models';
import { BattleContext } from '@/contexts';
import { EnemyEntity, EnemyInstance } from '@/ecs/entities';
import { PlayerEntity, PlayerInstance } from '@/ecs/entities/player-entity';

export const BattleProvider = ({ children }: PropsWithChildren) => {
	const [battle, setBattle] = useState<BattleModel>();

	const [player, setPlayer] = useState<PlayerInstance>();
	const [enemies, setEnemies] = useState<Record<string, EnemyInstance>>({});
	const [combatLog, setCombatLog] = useState<string[]>([]);

	const startBattle = (battle: BattleModel) => {
		setBattle(battle);

		setPlayer(() => {
			const player = PlayerEntity();
			player.setSpells(player.spellIds);

			return player;
		});

		setEnemies(
			battle.enemyTypeIds.reduce((accumulator, currentValue) => {
				const enemy = EnemyEntity(currentValue);

				return {
					...accumulator,
					[enemy.id]: enemy,
				};
			}, {} as typeof enemies)
		);
	};

	const handleCastSpell = ({
		casterId,
		targetId,
		spellId,
	}: {
		casterId: string;
		targetId: string;
		spellId: SPELL_IDS;
	}) => {
		console.log('casterId:', casterId);
		console.log('targetId:', targetId);
		console.log('spellId:', spellId);
		// setEnemies((previousValue) => {
		// 	previousValue[targetId].adjustHealth(amount);

		// 	return {
		// 		...previousValue,
		// 	};
		// });

		setCombatLog((previousValue) => [...previousValue, `handleCastSpell fired.`]);
	};

	const value = {
		startBattle,
		battle,
		player,
		enemies,
		handleCastSpell,
		combatLog,
	};

	return <BattleContext.Provider value={value}>{children}</BattleContext.Provider>;
};
