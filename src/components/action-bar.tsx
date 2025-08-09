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
		...boxShadow(),
		display: 'flex',
		borderRadius: 8,
		alignItems: 'center',
		backgroundColor: theme.colors.gray800,
		padding: `${padding}px ${padding - gutter}px ${padding}px ${padding}px`,
	},
	spellList: {
		display: 'flex',
	},
	divider: {
		width: 1,
		height: 32,
		backgroundColor: theme.colors.gray700,
		margin: `0 ${gutter * 2}px 0 ${gutter * 1}px`,
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
	potions: SpellState[];
	disabled?: boolean;
	className?: string;
}

export const ActionBar = ({ spells, potions, disabled, className }: ActionBarProps) => {
	const { classes } = useStyles();

	return (
		<div className={classNames(classes.actionBar, className)}>
			<Droppable droppableId="SPELLS" isDropDisabled direction="horizontal">
				{(droppableProvided) => (
					<div
						{...droppableProvided.droppableProps}
						ref={droppableProvided.innerRef}
						className={classes.spellList}
					>
						{spells.map((spell, spellIndex) => (
							<Draggable
								key={spell.spellId}
								draggableId={spell.spellId}
								index={spellIndex}
								isDragDisabled={disabled || spell.isOnCooldown}
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
			<div className={classes.divider} />
			<Droppable droppableId="POTIONS" isDropDisabled direction="horizontal">
				{(droppableProvided) => (
					<div
						{...droppableProvided.droppableProps}
						ref={droppableProvided.innerRef}
						className={classes.spellList}
					>
						{potions.map((spell, spellIndex) => (
							<Draggable
								key={spell.spellId}
								draggableId={spell.spellId}
								index={spellIndex}
								isDragDisabled={disabled || spell.isOnCooldown}
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
		</div>
	);
};
