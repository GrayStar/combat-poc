import { useBattle } from '@/hooks';

export const Battle = () => {
	const { battle, enemies } = useBattle();

	return (
		<div>
			<h3>{battle?.title}</h3>
			<ul>
				{enemies.map((enemy) => {
					return (
						<li key={enemy.id} className="mb-5">
							<p>
								{enemy.title}: {enemy.id}
							</p>
							<p>health: {enemy.health}</p>
							<button
								onClick={() => {
									enemy.adjustHealth(-1);
								}}
							>
								Hurt
							</button>
							<button
								onClick={() => {
									enemy.adjustHealth(+1);
								}}
							>
								Heal
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
};
