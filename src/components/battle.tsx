import { useBattle } from '@/hooks';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { Character, Spell } from '@/components';

export const Battle = () => {
	const { battle, handleCastSpell, combatLog } = useBattle();

	if (!battle) {
		return null;
	}

	const availableSpells = Object.values(battle.friendlyCharacters).flatMap((i) => Object.values(i.spells));
	const availableFriendlyIds = Object.values(battle.friendlyCharacters).flatMap((i) => i.characterId);

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) {
			return;
		}

		const spellId = availableSpells.find((s) => s.spellId === result.draggableId)?.spellTypeId;

		if (!spellId) {
			return;
		}

		handleCastSpell({
			casterId: availableFriendlyIds[0],
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
						{Object.values(battle?.hostileCharacters ?? {}).map((enemy) => (
							<Droppable key={enemy.characterId} droppableId={enemy.characterId}>
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
						{Object.values(battle?.friendlyCharacters ?? {}).map((friend) => (
							<Droppable key={friend.characterId} droppableId={friend.characterId}>
								{(provided) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className="border rounded bg-white"
									>
										<Character
											title={friend.title}
											health={friend.health}
											maxHealth={friend.maxHealth}
											mana={friend.mana}
											maxMana={friend.maxMana}
										/>
									</div>
								)}
							</Droppable>
						))}
					</div>

					<Droppable droppableId="SPELLS" isDropDisabled direction="horizontal">
						{(droppableProvided) => (
							<div
								{...droppableProvided.droppableProps}
								ref={droppableProvided.innerRef}
								className="d-flex"
							>
								{availableSpells.map((spell, spellIndex) => (
									<Draggable key={spell.spellId} draggableId={spell.spellId} index={spellIndex}>
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
