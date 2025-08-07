import { Draggable, Droppable } from '@hello-pangea/dnd';
import { SpellState } from '@/lib/spell/spell-class';
import { Spell, SpellShell } from '@/components/spell';
import { tss } from '@/styles';
import classNames from 'classnames';

const useStyles = tss.create((theme) => ({
	actionBar: {
		padding: 8,
		paddingRight: 0,
		display: 'flex',
		borderRadius: 16,
		backgroundColor: theme.colors.gray700,
	},
	draggableContainer: {
		paddingRight: 8,
	},
	draggableContainerClone: {
		paddingRight: 8,
		'~ div': {
			transform: 'none !important',
		},
	},
	dragging: {
		boxShadow: `0px 4px 8px rgba(0,0,0,0.2)`,
	},
}));

interface ActionBarProps {
	spells: SpellState[];
	disabled?: boolean;
}

export const ActionBar = ({ spells, disabled }: ActionBarProps) => {
	const { classes } = useStyles();

	return (
		<Droppable droppableId="SPELLS" isDropDisabled direction="horizontal">
			{(droppableProvided) => (
				<div
					{...droppableProvided.droppableProps}
					ref={droppableProvided.innerRef}
					className={classes.actionBar}
				>
					{spells.map((spell, spellIndex) => (
						<Draggable
							key={spell.spellId}
							draggableId={spell.spellId}
							index={spellIndex}
							isDragDisabled={spell.isOnCooldown || disabled}
						>
							{(draggableProvided, draggableSnapshot) => (
								<>
									<div
										ref={draggableProvided.innerRef}
										{...draggableProvided.draggableProps}
										{...draggableProvided.dragHandleProps}
									>
										<div className={classes.draggableContainer}>
											<Spell
												spell={spell}
												className={classNames({
													[classes.dragging]: draggableSnapshot.isDragging,
												})}
											/>
										</div>
									</div>
									{draggableSnapshot.isDragging && (
										<div className={classes.draggableContainerClone}>
											<SpellShell />
										</div>
									)}
								</>
							)}
						</Draggable>
					))}
				</div>
			)}
		</Droppable>
	);
};
