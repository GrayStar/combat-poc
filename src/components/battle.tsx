import { useBattle } from '@/hooks';

export const Battle = () => {
	const { battle, enemies, handleCastSpell, combatLog } = useBattle();

	return (
		<div>
			<h3>{battle?.title}</h3>
			<ul className="mb-5 d-flex align-items-center">
				{Object.values(enemies).map((enemy) => {
					return (
						<li key={enemy.id} className="px-4">
							<p>{enemy.title}</p>
							<p>health: {enemy.health}</p>
							<button
								onClick={() => {
									handleCastSpell({ targetId: enemy.id, amount: -1 });
								}}
							>
								Hurt
							</button>
							<button
								onClick={() => {
									handleCastSpell({ targetId: enemy.id, amount: +1 });
								}}
							>
								Heal
							</button>
						</li>
					);
				})}
			</ul>
			<div className="border bg-gray200 rounded">
				<h3>Combat Log</h3>
				{combatLog.map((message) => (
					<p>{message}</p>
				))}
			</div>
		</div>
	);
};
