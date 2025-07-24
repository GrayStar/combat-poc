import { useBattle } from '@/hooks';

export const Battle = () => {
	const { battle, player, enemies, handleCastSpell, combatLog } = useBattle();

	return (
		<div>
			<h3>{battle?.title}</h3>
			<ul className="mb-5 d-flex align-items-center">
				{Object.values(enemies).map((enemy) => {
					return (
						<li key={enemy.id} className="px-4">
							<p>{enemy.title}</p>
							<p>health: {enemy.health}</p>
						</li>
					);
				})}
			</ul>

			<ul className="mb-5 d-flex align-items-center">
				{player?.spells.map((spell) => (
					<li key={spell.id}>
						<button
							onClick={() => {
								handleCastSpell({ casterId: player.id, targetId: '', spellId: spell.spellId });
							}}
						>
							{spell.title}
						</button>
					</li>
				))}
			</ul>

			<div className="border bg-gray200 rounded">
				<h3>Combat Log</h3>
				{combatLog.map((message, messageIndex) => (
					<p key={messageIndex}>{message}</p>
				))}
			</div>
		</div>
	);
};
