import { useBattle } from '@/hooks';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { Character, Spell } from '@/components';

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
					<div className="d-flex mb-5">
						{Object.values(enemies).map((enemy) => (
							<Droppable key={enemy.id} droppableId={enemy.id}>
								{(provided) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className="border rounded bg-white"
									>
										<Character
											title={enemy.title}
											health={enemy.health}
											maxHealth={enemy.maxHealth}
											mana={enemy.mana}
											maxMana={enemy.maxMana}
										/>
									</div>
								)}
							</Droppable>
						))}
					</div>

					<div className="d-flex mb-5">
						{player && (
							<div className="border rounded bg-white">
								<Character
									title={player.title}
									health={player.health}
									maxHealth={player.maxHealth}
									mana={player.mana}
									maxMana={player.maxMana}
								/>
							</div>
						)}
					</div>

					<Droppable droppableId="SPELLS" isDropDisabled direction="horizontal">
						{(droppableProvided) => (
							<div
								{...droppableProvided.droppableProps}
								ref={droppableProvided.innerRef}
								className="d-flex"
							>
								{(player?.spells ?? []).map((spell, spellIndex) => (
									<Draggable key={spell.id} draggableId={spell.id} index={spellIndex}>
										{(draggableProvided, draggableSnapshot) => (
											<>
												<div
													{...draggableProvided.draggableProps}
													{...draggableProvided.dragHandleProps}
													ref={draggableProvided.innerRef}
												>
													<Spell title={spell.title} />
												</div>
												{draggableSnapshot.isDragging && (
													<div style={{ transform: 'none !important' }}>
														<Spell title={spell.title} />
													</div>
												)}
											</>
										)}
									</Draggable>
								))}
							</div>
						)}
					</Droppable>
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
