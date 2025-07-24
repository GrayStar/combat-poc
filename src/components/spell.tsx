import { tss } from '@/styles';

const useStyles = tss.create((theme) => ({
	spell: {
		width: 48,
		height: 48,
		borderRadius: 8,
		overflow: 'hidden',
		backgroundColor: theme.colors.gray400,
		border: `1px solid ${theme.colors.black}`,
	},
}));

interface SpellProps {
	title: string;
}

export const Spell = ({ title }: SpellProps) => {
	const { classes } = useStyles();
	return <div className={classes.spell}>{title}</div>;
};
