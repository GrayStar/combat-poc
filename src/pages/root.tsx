import { battleData } from '@/lib/data';
import { BattleModel } from '@/lib/models';
import { BattleProvider } from '@/contexts';
import { useBattle } from '@/hooks';
import { Battle } from '@/components';

const POC = () => {
	const { startBattle } = useBattle();

	const handleBattleButtonClick = (battle: BattleModel) => {
		startBattle(battle);
	};

	return (
		<div>
			<h1>Available Battles</h1>
			<ul>
				{Object.values(battleData).map((battle) => (
					<li key={battle.battleId}>
						<button onClick={() => handleBattleButtonClick(battle)}>{battle.title}</button>
					</li>
				))}
			</ul>

			<h2>Battle</h2>
			<Battle />
		</div>
	);
};

export const Root = () => {
	return (
		<BattleProvider>
			<POC />
		</BattleProvider>
	);
};
