import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useBattle } from '@/hooks';
import { Character } from '@/components';
import { ActionBar } from '@/components/action-bar';
import { tss } from '@/styles';
import { Button } from 'react-bootstrap';

const useStyles = tss.create(() => ({
	actionBarOuter: {
		left: 16,
		right: 16,
		bottom: 16,
		display: 'flex',
		position: 'absolute',
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'center',
	},
}));

export const Battle = () => {
	const { classes } = useStyles();
	const { battle, handleCastSpell, handleAbortCastSpell } = useBattle();

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
						<div className="d-flex mb-5 justify-content-center">
							{battle.hostileNonPlayerCharacterIds.map((characterId) => {
								const character = battle.characters[characterId];

								return (
									<Droppable key={character.characterId} droppableId={character.characterId}>
										{(provided) => (
											<div {...provided.droppableProps} ref={provided.innerRef}>
												<Character character={character} />
											</div>
										)}
									</Droppable>
								);
							})}
						</div>
					)}

					<div className="d-flex mb-5 justify-content-center">
						<Droppable droppableId={playerCharacter.characterId}>
							{(provided) => (
								<div {...provided.droppableProps} ref={provided.innerRef}>
									<Character character={playerCharacter} />
								</div>
							)}
						</Droppable>
						{battle.friendlyNonPlayerCharacterIds.length > 0 && (
							<>
								{battle.friendlyNonPlayerCharacterIds.map((characterId) => {
									const character = battle.characters[characterId];

									return (
										<Droppable key={character.characterId} droppableId={character.characterId}>
											{(provided) => (
												<div {...provided.droppableProps} ref={provided.innerRef}>
													<Character character={character} />
												</div>
											)}
										</Droppable>
									);
								})}
							</>
						)}
					</div>

					<div className={classes.actionBarOuter}>
						{playerCharacter.isCastingSpell && (
							<Button
								size="lg"
								variant="warning"
								className="mb-2"
								onClick={() => {
									handleAbortCastSpell({ casterId: playerCharacter.characterId });
								}}
							>
								Cancel {playerCharacter.isCastingSpell.title}
							</Button>
						)}
						<ActionBar spells={playerCharacter.spells} disabled={!!playerCharacter.isCastingSpell} />
					</div>
				</>
			</DragDropContext>

			<div>
				{battle.combatLog.map((entry) => (
					<p className="mb-0 small" key={entry.combatLogEntryId}>
						[{entry.timeDescription}]:{entry.message}
					</p>
				))}
			</div>
		</div>
	);
};
