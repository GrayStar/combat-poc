import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { useBattle } from '@/hooks';
import { Character, Spell } from '@/components';

export const Battle = () => {
	const { battle, handleCastSpell } = useBattle();

	if (!battle) {
		return null;
	}

	const playerCharacter = battle.characters[battle.playerCharacterId];

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) {
			return;
		}

		handleCastSpell({
			casterId: playerCharacter.characterId,
			targetId: result.destination.droppableId,
			spellId: result.draggableId,
		});
	};

	return (
		<div>
			<h3>{battle?.title}</h3>

			<DragDropContext onDragEnd={handleDragEnd}>
				<>
					{battle.hostileNonPlayerCharacterIds.length > 0 && (
						<div className="d-flex mb-5">
							{battle.hostileNonPlayerCharacterIds.map((characterId) => {
								const character = battle.characters[characterId];

								return (
									<Droppable key={character.characterId} droppableId={character.characterId}>
										{(provided) => (
											<div
												{...provided.droppableProps}
												ref={provided.innerRef}
												className="border rounded bg-white"
											>
												<Character character={character} />
											</div>
										)}
									</Droppable>
								);
							})}
						</div>
					)}

					{battle.friendlyNonPlayerCharacterIds.length > 0 && (
						<div className="d-flex mb-5">
							{battle.friendlyNonPlayerCharacterIds.map((characterId) => {
								const character = battle.characters[characterId];

								return (
									<Droppable key={character.characterId} droppableId={character.characterId}>
										{(provided) => (
											<div
												{...provided.droppableProps}
												ref={provided.innerRef}
												className="border rounded bg-white"
											>
												<Character character={character} />
											</div>
										)}
									</Droppable>
								);
							})}
						</div>
					)}

					<div className="d-flex mb-5">
						<Droppable droppableId={playerCharacter.characterId}>
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className="border rounded bg-white"
								>
									<Character character={playerCharacter} />
								</div>
							)}
						</Droppable>
					</div>

					<Droppable droppableId="SPELLS" isDropDisabled direction="horizontal">
						{(droppableProvided) => (
							<div
								{...droppableProvided.droppableProps}
								ref={droppableProvided.innerRef}
								className="d-flex"
							>
								{playerCharacter.spellIds.map((spellId, spellIndex) => {
									const spell = battle.spells[spellId];

									return (
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
									);
								})}
							</div>
						)}
					</Droppable>
				</>
			</DragDropContext>
		</div>
	);
};
