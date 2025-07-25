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
			<h3>Available Battles</h3>
			<ul className="list-unstyled d-flex align-items-center">
				{Object.values(battleData).map((battle) => (
					<li key={battle.battleTypeId}>
						<button onClick={() => handleBattleButtonClick(battle)}>{battle.title}</button>
					</li>
				))}
			</ul>

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
