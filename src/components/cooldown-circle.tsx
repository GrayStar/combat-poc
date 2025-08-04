import { keyframes } from 'tss-react';
import { tss } from '@/styles';

interface UseStyleProps extends Record<string, unknown> {
	durationInMs: number;
	radius: number;
	circumference: number;
}

const useStyles = tss.withParams<UseStyleProps>().create(({ durationInMs, radius, circumference }) => {
	const clockAnimation = keyframes`
            from {
                stroke-dashoffset: 0;
            }
            to {
                stroke-dashoffset: ${circumference};
            }
        `;

	return {
		svg: {
			top: '50%',
			left: '50%',
			right: 0,
			bottom: 0,
			zIndex: 1,
			position: 'absolute',
			pointerEvents: 'none',
			transform: 'translate(-50%, -50%) scaleX(-1) rotate(-90deg) ',
		},
		cooldown: {
			fill: 'none',
			stroke: 'rgba(0,0,0,0.5)',
			strokeWidth: radius * 2,
			strokeDasharray: circumference,
			transformOrigin: 'center',
			animation: `${clockAnimation} ${durationInMs}ms linear forwards`,
		},
	};
});

interface CooldownCircleProps {
	size: number;
	durationInMs: number;
}

export const CooldownCircle = ({ size, durationInMs }: CooldownCircleProps) => {
	const diameter = size * Math.SQRT2;
	const radius = diameter / 2;
	const circumference = Math.PI * 2 * radius;

	const { classes } = useStyles({ radius, circumference, durationInMs });

	return (
		<svg width={diameter} height={diameter} className={classes.svg}>
			<circle className={classes.cooldown} r={radius} cx={radius} cy={radius} />
		</svg>
	);
};
