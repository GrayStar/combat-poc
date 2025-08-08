import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useBattle } from '@/hooks';
import { tss } from '@/styles';
import { boxShadow } from '@/styles/mixins/box-shadow';

const useStyles = tss.create((theme) => ({
	combatLogOuter: {
		left: 16,
		bottom: 16,
		padding: 16,
		height: 100,
		borderRadius: 16,
		overflowY: 'auto',
		color: theme.colors.gray200,
		backgroundColor: theme.colors.gray800,
		...boxShadow(),
	},
}));

interface CombatLogProps {
	className?: string;
}

export const CombatLog = ({ className }: CombatLogProps) => {
	const { classes } = useStyles();
	const { battle } = useBattle();
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [battle?.combatLog]);

	if (!battle) {
		return null;
	}

	return (
		<div className={classNames(classes.combatLogOuter, className)}>
			{battle.combatLog.map((entry) => (
				<p className="mb-0 small" key={entry.combatLogEntryId}>
					[{entry.timeDescription}]: {entry.message}
				</p>
			))}
			<div ref={scrollRef} />
		</div>
	);
};
