import classNames from 'classnames';
import { tss } from '@/styles';
import { AuraState } from '@/lib/spell/aura-class';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CooldownCircle } from '@/components/cooldown-circle';

const size = 24;

const useStyles = tss.create((theme) => ({
	statusEffect: {
		zIndex: 0,
		width: size,
		height: size,
		borderRadius: 4,
		overflow: 'hidden',
		position: 'relative',
		backgroundColor: theme.colors.gray700,
	},
	stackCount: {
		right: 4,
		bottom: 4,
		zIndex: 2,
		width: 16,
		height: 16,
		borderRadius: 4,
		position: 'absolute',
		textAlign: 'center',
		color: theme.colors.white,
		fontSize: theme.fonts.xs,
		lineHeight: '1.6rem',
		backgroundColor: theme.colors.black,
	},
}));

interface StatusEffectProps {
	statusEffect: AuraState;
	className?: string;
}

export const StatusEffect = ({ statusEffect, className }: StatusEffectProps) => {
	const { classes } = useStyles();

	return (
		<OverlayTrigger
			overlay={
				<Tooltip>
					<div className="d-flex align-items-center justify-content-between">
						<h6 className="m-0 text-warning">{statusEffect.title}</h6>
						<h6 className="m-0 text-warning">{statusEffect.dispelTypeId}</h6>
					</div>
					<p className="m-0 small text-start">{statusEffect.description}</p>
				</Tooltip>
			}
		>
			<div className={classNames(classes.statusEffect, className)}>
				<CooldownCircle size={size} durationInMs={statusEffect.durationInMs} key={statusEffect.renderKey} />
				<p className="m-0">{statusEffect.title}</p>
				{/* {(statusEffect.stacks ?? 0) > 0 && <div className={classes.stackCount}>{statusEffect.stacks}</div>} */}
			</div>
		</OverlayTrigger>
	);
};
