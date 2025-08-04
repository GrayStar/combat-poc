import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { tss } from '@/styles';
import { useRef } from 'react';
import { SpellState } from '@/lib/spell/spell-class';
import { CooldownCircle } from '@/components/cooldown-circle';

const size = 48;
const flashAnimationDurationInMs = 1000;

const useStyles = tss.create((theme) => ({
	spell: {
		width: size,
		height: size,
		borderRadius: 8,
		overflow: 'hidden',
		textAlign: 'center',
		position: 'relative',
		backgroundColor: theme.colors.gray400,
	},
	flash: {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 2,
		opacity: 0,
		position: 'absolute',
		pointerEvents: 'none',
		backgroundColor: theme.colors.white,
	},
	flashEnter: {
		opacity: 0.75,
	},
	flashEnterActive: {
		opacity: 0,
		transition: `opacity ${flashAnimationDurationInMs}ms linear`,
	},
}));

interface SpellProps {
	spell: SpellState;
	className?: string;
}

export const Spell = ({ spell, className }: SpellProps) => {
	const { classes } = useStyles();
	const overlayRef = useRef<HTMLDivElement>(null);

	return (
		<div className={classNames(classes.spell, className)}>
			<CSSTransition
				in={!spell.isOnCooldown}
				timeout={flashAnimationDurationInMs}
				classNames={{
					enter: classes.flashEnter,
					enterActive: classes.flashEnterActive,
				}}
				nodeRef={overlayRef}
				mountOnEnter
				unmountOnExit
			>
				<div ref={overlayRef} className={classes.flash} />
			</CSSTransition>
			{spell.isOnCooldown && <CooldownCircle size={size} durationInMs={spell.cooldownDurationInMs} />}
			<span className="small">{spell.title}</span>
		</div>
	);
};
