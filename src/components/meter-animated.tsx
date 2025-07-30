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
		height: 8,
		width: '100%',
		borderRadius: 500,
		overflow: 'hidden',
		position: 'relative',
		backgroundColor: theme.colors.gray800,
	},
	meter: {
		top: 0,
		left: 0,
		bottom: 0,
		borderRadius: 500,
		width: '0%',
		position: 'absolute',
		transition: `width 200ms`,
		backgroundColor: color ?? theme.colors.primary,
		animation: `${fillAnimation} ${durationInMs}ms linear forwards`,
	},
}));

interface MeterAnimatedProps {
	durationInMs: number;
	color?: string;
	className?: string;
}

export const MeterAnimated = ({ durationInMs, color, className }: MeterAnimatedProps) => {
	const { classes } = useStyles({ durationInMs, color });

	return (
		<div className={classNames(classes.meterOuter, className)}>
			<div className={classes.meter} />
		</div>
	);
};
