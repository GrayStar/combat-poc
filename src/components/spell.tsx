import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { tss } from '@/styles';
import { useRef } from 'react';
import { SpellState } from '@/lib/spell/spell-class';
import { CooldownCircle } from '@/components/cooldown-circle';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const size = 48;
const borderRadius = 8;
const flashAnimationDurationInMs = 1000;

const useStyles = tss.create((theme) => ({
	spell: {
		width: size,
		height: size,
		overflow: 'hidden',
		textAlign: 'center',
		position: 'relative',
		borderRadius: borderRadius,
		backgroundColor: theme.colors.gray700,
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
	tooltip: {
		width: 320,
		'& .tooltip-inner': {
			padding: 8,
			maxWidth: '100%',
		},
		'& p': {
			whiteSpace: 'pre-wrap',
		},
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
		<OverlayTrigger
			overlay={
				<Tooltip className={classes.tooltip}>
					<h6 className="mb-0 text-start">{spell.title}</h6>
					<p className="mb-0 small text-start text-nowrap">{spell.costDescription}</p>
					<div className="mb-3 d-flex align-items-center justify-content-between">
						<p className="mb-0 small text-nowrap">{spell.castTimeDescription}</p>
						<p className="mb-0 small text-nowrap">{spell.cooldownDescription}</p>
					</div>
					<p className="mb-3 small text-start text-warning fst-italic">{spell.description}</p>
					<p className="mb-0 small text-start text-warning">{spell.spellEffectDescription}</p>
				</Tooltip>
			}
		>
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
				{spell.isOnCooldown && (
					<CooldownCircle size={size} durationInMs={spell.cooldownAnimationDurationInMs} />
				)}
				<span className="small">{spell.title}</span>
			</div>
		</OverlayTrigger>
	);
};

const useSpellShellStyles = tss.create((theme) => ({
	spellShell: {
		width: size,
		height: size,
		borderRadius: borderRadius,
		backgroundColor: theme.colors.gray900,
	},
}));

export const SpellShell = () => {
	const { classes } = useSpellShellStyles();
	return <div className={classes.spellShell} />;
};
