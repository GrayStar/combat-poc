import { keyframes } from 'tss-react';
import classNames from 'classnames';
import { tss } from '@/styles';

const fillAnimation = keyframes`
    from {
        width: 10%;
    }
    to {
        width: 100%;
    }
`;

interface UseStyleProps extends Record<string, unknown> {
	durationInMs: number;
	color?: string;
}

const useStyles = tss.withParams<UseStyleProps>().create(({ durationInMs, color, ...theme }) => ({
	meterOuter: {
		height: 16,
		width: '100%',
		borderRadius: 4,
		overflow: 'hidden',
		position: 'relative',
		backgroundColor: theme.colors.gray800,
	},
	meter: {
		top: 0,
		left: 0,
		bottom: 0,
		width: '0%',
		position: 'absolute',
		transition: `width 200ms`,
		backgroundColor: color ?? theme.colors.primary,
		animation: `${fillAnimation} ${durationInMs}ms linear forwards`,
	},
	title: {
		top: 0,
		left: 0,
		right: 0,
		zIndex: 2,
		bottom: 0,
		display: 'flex',
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: theme.fonts.xxs,
		color: theme.colors.white,
	},
}));

interface MeterAnimatedProps {
	durationInMs: number;
	title?: string;
	color?: string;
	className?: string;
}

export const MeterAnimated = ({ durationInMs, title, color, className }: MeterAnimatedProps) => {
	const { classes } = useStyles({ durationInMs, color });

	return (
		<div className={classNames(classes.meterOuter, className)}>
			{title && <div className={classes.title}>{title}</div>}
			<div className={classes.meter} />
		</div>
	);
};
