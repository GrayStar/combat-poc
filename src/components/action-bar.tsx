import { Draggable, Droppable } from '@hello-pangea/dnd';
import classNames from 'classnames';
import { SpellState } from '@/lib/spell/spell-class';
import { Spell, SpellShell } from '@/components/spell';
import { tss } from '@/styles';
import { boxShadow } from '@/styles/mixins/box-shadow';

const padding = 8;
const gutter = 5;

const useStyles = tss.create((theme) => ({
	actionBar: {
		display: 'flex',
		borderRadius: 8,
		backgroundColor: theme.colors.gray800,
		...boxShadow(),
		padding: `${padding}px ${padding - gutter}px ${padding}px ${padding}px`,
	},
	draggableContainer: {
		paddingRight: gutter,
	},
	draggableContainerClone: {
		paddingRight: gutter,
		'~ div': {
			transform: 'none !important',
		},
	},
	dragging: {
		...boxShadow(),
	},
}));

interface ActionBarProps {
	spells: SpellState[];
	disabled?: boolean;
	className?: string;
}

export const ActionBar = ({ spells, disabled, className }: ActionBarProps) => {
	const { classes } = useStyles();

	return (
		<Droppable droppableId="SPELLS" isDropDisabled direction="horizontal">
			{(droppableProvided) => (
				<div
					{...droppableProvided.droppableProps}
					ref={droppableProvided.innerRef}
					className={classNames(classes.actionBar, className)}
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
