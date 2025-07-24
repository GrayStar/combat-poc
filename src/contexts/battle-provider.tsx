import { PropsWithChildren, useState } from 'react';
import { BattleModel, SPELL_IDS } from '@/lib/models';
import { BattleContext } from '@/contexts';
import { EnemyEntity, EnemyInstance } from '@/ecs/entities';
import { PlayerEntity, PlayerInstance } from '@/ecs/entities/player-entity';
import { SpellInstance } from '@/lib/instances';

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

	const handleCastSpell = async ({
		casterId,
		targetId,
		spellId,
	}: {
		casterId: string;
		targetId: string;
		spellId: SPELL_IDS;
	}) => {
		// todo: change this spell instance generation to caster.castSpell
		// caster.castSpell should apply buff/debuff alterations to the spell instance before the target recieves it
		// eslint-disable-next-line no-console
		console.log('casterId:', casterId);

		try {
			if (!player) {
				throw new Error('player is undefined.');
			}

			let spellCastInstance: SpellInstance;

			setPlayer((previousValue) => {
				if (!previousValue) {
					return;
				}

				spellCastInstance = previousValue.castSpell(spellId);
				return previousValue;
			});

			setEnemies((previousValue) => {
				previousValue[targetId].recieveSpell(spellCastInstance);
				return previousValue;
			});

			setCombatLog((previousValue) => [
				`__CASTER__ casts ${spellCastInstance.title} on __TARGET__.`,
				...previousValue,
			]);
		} catch (error) {
			setCombatLog((previousValue) => [error as string, ...previousValue]);
		}
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
