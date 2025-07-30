import { keyframes } from 'tss-react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { SpellState } from '@/lib/spell';
import { tss } from '@/styles';
import { useRef } from 'react';

const flashAnimationDurationInMs = 500;
const cooldownAnimation = keyframes`
	from {
		height: 100%;
	}
	to {
		height: 0%;
	}
`;

interface UseStyleProps extends Record<string, unknown> {
	cooldownDurationInMs: number;
}

const useStyles = tss.withParams<UseStyleProps>().create(({ cooldownDurationInMs, ...theme }) => ({
	spell: {
		width: 48,
		height: 48,
		borderRadius: 8,
		overflow: 'hidden',
		textAlign: 'center',
		position: 'relative',
		backgroundColor: theme.colors.gray400,
	},
	cooldown: {
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1,
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		animation: `${cooldownAnimation} ${cooldownDurationInMs}ms linear forwards`,
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
		opacity: 0.5,
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
	const { classes } = useStyles({ cooldownDurationInMs: spell.cooldownDurationInMs });
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
			{spell.isOnCooldown && <div className={classes.cooldown} />}
			<span className="small">{spell.title}</span>
		</div>
	);
};
