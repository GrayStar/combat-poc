import { useBattle } from '@/hooks';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';

export const Battle = () => {
	const { battle, player, enemies, handleCastSpell, combatLog } = useBattle();

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) {
			return;
		}

		const spellId = player?.spells.find((s) => s.id === result.draggableId)?.spellId;

		if (!spellId) {
			return;
		}

		handleCastSpell({
			casterId: player?.id ?? '',
			targetId: result.destination.droppableId,
			spellId,
		});
	};

	return (
		<div>
			<h3>{battle?.title}</h3>

			<DragDropContext onDragEnd={handleDragEnd}>
				<>
					<div className="d-flex">
						{Object.values(enemies).map((enemy) => {
							return (
								<Droppable droppableId={enemy.id}>
									{(provided) => (
										<div
											key={enemy.id}
											{...provided.droppableProps}
											ref={provided.innerRef}
											className="border"
										>
											<p>{enemy.title}</p>
											<p>health: {enemy.health}</p>
										</div>
									)}
								</Droppable>
							);
						})}
					</div>

					<div className="d-flex">
						{player?.spells.map((spell, spellIndex) => (
							<Droppable droppableId="SPELLS">
								{(droppableProvided) => (
									<div
										key={spell.id}
										{...droppableProvided.droppableProps}
										ref={droppableProvided.innerRef}
									>
										<Draggable key={spell.id} draggableId={spell.id} index={spellIndex}>
											{(draggableProvided) => (
												<div
													ref={draggableProvided.innerRef}
													{...draggableProvided.draggableProps}
													{...draggableProvided.dragHandleProps}
													className="border"
													onClick={() => {
														handleCastSpell({
															casterId: player.id,
															targetId: '',
															spellId: spell.spellId,
														});
													}}
												>
													{spell.title}
												</div>
											)}
										</Draggable>
										{droppableProvided.placeholder}
									</div>
								)}
							</Droppable>
						))}
					</div>
				</>
			</DragDropContext>

			<div className="border bg-gray200 rounded">
				<h3>Combat Log</h3>
				{combatLog.map((message, messageIndex) => (
					<p key={messageIndex}>{message}</p>
				))}
			</div>
		</div>
	);
};
