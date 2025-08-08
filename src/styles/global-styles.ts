import { CSSInterpolation } from 'tss-react';
import { ThemeConfig } from '@/styles/themes';

export const getGlobalStyles = (theme: ThemeConfig) => {
	return {
		// Main
		html: {
			height: '100%',
			fontSize: '10px',
		},
		body: {
			minHeight: '100%',
			position: 'relative',
			fontSize: theme.fonts.body,
			color: theme.colors.gray300,
			fontWeight: theme.fontWeights.normal,
			backgroundColor: theme.colors.gray900,
		},

		// Typography
		'h1, .h1': {
			fontSize: theme.fonts.h1,
			fontWeight: theme.fontWeights.semiBold,
		},
		'h2, .h2': {
			fontSize: theme.fonts.h2,
			fontWeight: theme.fontWeights.semiBold,
		},
		'h3, .h3': {
			fontSize: theme.fonts.h3,
			fontWeight: theme.fontWeights.semiBold,
		},
		'h4, .h4': {
			fontSize: theme.fonts.h4,
			fontWeight: theme.fontWeights.semiBold,
		},
		'h5, .h5': {
			fontSize: theme.fonts.h5,
			fontWeight: theme.fontWeights.semiBold,
		},
		'h6, .h6': {
			fontSize: theme.fonts.h6,
			fontWeight: theme.fontWeights.semiBold,
		},
		'p, .p': {
			fontSize: theme.fonts.body,
		},
		'.display-1': {
			fontSize: theme.fonts.display1,
			fontWeight: theme.fontWeights.bold,
		},
		'.display-2': {
			fontSize: theme.fonts.display2,
			fontWeight: theme.fontWeights.bold,
		},
		'.display-3': {
			fontSize: theme.fonts.display3,
			fontWeight: theme.fontWeights.bold,
		},
		'.display-4': {
			fontSize: theme.fonts.display4,
			fontWeight: theme.fontWeights.bold,
		},
		'.body': {
			fontSize: theme.fonts.body,
			fontWeight: theme.fontWeights.normal,
		},
		'.lead': {
			fontSize: theme.fonts.lead,
			fontWeight: theme.fontWeights.normal,
		},
		'a, .a': {
			fontWeight: 'inherit',
			textDecoration: 'none',
			color: theme.colors.primary,
			'&:hover, &:active': {
				textDecoration: 'underline',
				color: theme.colors.primary,
			},
			'&:disabled': {
				color: theme.colors.primary,
			},
		},
		'.small': {
			fontSize: theme.fonts.small,
		},
		'.extra-small': {
			fontSize: theme.fonts.xs,
		},

		'.fw-normal': {
			fontWeight: theme.fontWeights.normal,
		},
		'.fw-semi-bold': {
			fontWeight: theme.fontWeights.semiBold,
		},
		'.fw-bold': {
			fontWeight: theme.fontWeights.bold,
		},
		'.fw-bolder': {
			fontWeight: theme.fontWeights.extraBold,
		},

		// Text Colors
		'.text-primary': {
			color: `${theme.colors.primary} !important`,
		},
		'.text-secondary': {
			color: `${theme.colors.secondary} !important`,
		},
		'.text-success': {
			color: `${theme.colors.success} !important`,
		},
		'.text-warning': {
			color: `${theme.colors.warning} !important`,
		},
		'.text-danger': {
			color: `${theme.colors.danger} !important`,
		},
		'.text-info': {
			color: `${theme.colors.info} !important`,
		},
		'.text-gray600': {
			color: `${theme.colors.gray600} !important`,
		},
		'.text-gray700': {
			color: `${theme.colors.gray700} !important`,
		},
		'.text-gray800': {
			color: `${theme.colors.gray800} !important`,
		},

		// Bg Colors
		'.bg-gray100': {
			backgroundColor: theme.colors.gray100,
		},
		'.bg-gray200': {
			backgroundColor: theme.colors.gray200,
		},
		'.bg-gray300': {
			backgroundColor: theme.colors.gray300,
		},

		// Border Radius
		'.rounded': {
			borderRadius: '8px !important',
		},

		// Border Utilities
		'.border, .border-top, .border-right, .border-bottom, .border-left': {
			borderColor: `${theme.colors.gray300} !important`,
		},
	} as unknown as CSSInterpolation;
};
