import { useBattle } from '@/hooks';

export const Battle = () => {
	const { battle, enemies } = useBattle();
	return (
		<div>
			<h3>{battle?.title}</h3>
			<ul>
				{enemies.map((enemy) => {
					return <li>{enemy.title}</li>;
				})}
			</ul>
		</div>
	);
};
