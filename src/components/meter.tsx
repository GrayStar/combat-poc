import { tss } from '@/styles';

interface UseStyleProps extends Record<string, unknown> {
	percent: number;
	color?: string;
}

const useStyles = tss.withParams<UseStyleProps>().create(({ percent, color, ...theme }) => ({
	meterOuter: {
		height: 8,
		width: '100%',
		borderRadius: 500,
		overflow: 'hidden',
		position: 'relative',
		backgroundColor: theme.colors.gray400,
	},
	meter: {
		top: 0,
		left: 0,
		bottom: 0,
		borderRadius: 500,
		width: `${percent}%`,
		position: 'absolute',
		transition: `width 200ms`,
		backgroundColor: color ?? theme.colors.primary,
	},
}));

interface MeterProps {
	value: number;
	maxValue: number;
	color?: string;
}

export const Meter = ({ value, maxValue, color }: MeterProps) => {
	const percent = (value / maxValue) * 100;
	const { classes } = useStyles({ percent, color });

	return (
		<div className={classes.meterOuter}>
			<div className={classes.meter} />
		</div>
	);
};
