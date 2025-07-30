import { FC, useEffect, useState } from 'react';
import { BATTLE_TYPE_ID, BattleModel, battleService } from '@/lib/battle';
import { BattleProvider } from '@/contexts';
import { useBattle } from '@/hooks';
import { Battle } from '@/components';

const POC: FC = () => {
	const { battle, startBattle } = useBattle();
	const [battleOptions, setBattlesOptions] = useState<BattleModel[]>([]);

	useEffect(() => {
		const response = battleService.getBattleOptions();
		setBattlesOptions(response);
	}, []);

	const handleBattleOptionButtonClick = (battleTypeId: BATTLE_TYPE_ID) => {
		startBattle(battleTypeId);
	};

	useEffect(() => {
		return () => {
			if (!battle?.battleId) {
				return;
			}

			battleService.deleteBattleByBattleId(battle.battleId);
		};
	}, [battle?.battleId]);

	return (
		<div>
			<h3>Available Battles</h3>
			<ul className="list-unstyled d-flex align-items-center">
				{battleOptions.map((battleOption) => (
					<li key={battleOption.battleTypeId}>
						<button onClick={() => handleBattleOptionButtonClick(battleOption.battleTypeId)}>
							{battleOption.title}
						</button>
					</li>
				))}
			</ul>

			{battle && <Battle />}
		</div>
	);
};

export const Root: FC = () => {
	return (
		<BattleProvider>
			<POC />
		</BattleProvider>
	);
};
