import classNames from 'classnames';
import { tss } from '@/styles';

interface UseStyleProps extends Record<string, unknown> {
	percent: number;
	color?: string;
}

const useStyles = tss.withParams<UseStyleProps>().create(({ percent, color, ...theme }) => ({
	meterOuter: {
		zIndex: 0,
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
		zIndex: 1,
		width: `${percent}%`,
		position: 'absolute',
		borderRadius: 'inherit',
		transition: `width 200ms`,
		backgroundColor: color ?? theme.colors.primary,
	},
	values: {
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

interface MeterProps {
	value: number;
	maxValue: number;
	color?: string;
	showValue?: boolean;
	className?: string;
}

export const Meter = ({ value, maxValue, color, showValue, className }: MeterProps) => {
	const percent = (value / maxValue) * 100;
	const { classes } = useStyles({ percent, color });

	return (
		<div className={classNames(classes.meterOuter, className)}>
			{showValue && (
				<div className={classes.values}>
					{value}/{maxValue}
				</div>
			)}
			<div className={classes.meter} />
		</div>
	);
};
