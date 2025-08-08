import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useBattle } from '@/hooks';
import { Character } from '@/components';
import { ActionBar } from '@/components/action-bar';
import { tss } from '@/styles';
import { Button } from 'react-bootstrap';
import { CharacterState } from '@/lib/character/character-class';
import { CombatLog } from './combat-log';

const useStyles = tss.create(() => ({
	actionBarOuter: {
		left: 16,
		right: 16,
		bottom: 16,
		zIndex: 1,
		display: 'flex',
		position: 'fixed',
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	combatLogOuter: {
		width: '90%',
		maxWidth: 400,
	},
}));

export const Battle = () => {
	const { classes } = useStyles();
	const { battle, handleCastSpell, handleAbortCastSpell } = useBattle();

	if (!battle) {
		return null;
	}

	const playerCharacter: CharacterState | undefined = battle.characters[battle.playerCharacterId];

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) {
			return;
		}

		if (!playerCharacter) {
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
						{playerCharacter && (
							<Droppable droppableId={playerCharacter.characterId}>
								{(provided) => (
									<div {...provided.droppableProps} ref={provided.innerRef}>
										<Character character={playerCharacter} />
									</div>
								)}
							</Droppable>
						)}
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
						{playerCharacter?.isCastingSpell && (
							<Button
								size="lg"
								variant="warning"
								className="mb-3"
								onClick={() => {
									handleAbortCastSpell({ casterId: playerCharacter.characterId });
								}}
							>
								Cancel {playerCharacter.isCastingSpell.title}
							</Button>
						)}
						{playerCharacter && (
							<ActionBar
								className="mb-3"
								spells={playerCharacter.spells}
								disabled={!!playerCharacter.isCastingSpell}
							/>
						)}
						<CombatLog className={classes.combatLogOuter} />
					</div>
				</>
			</DragDropContext>
		</div>
	);
};
