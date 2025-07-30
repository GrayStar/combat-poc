export type ThemeConfig = typeof defaultTheme;

export const defaultTheme = {
	colors: {
		primary: '#77206E',
		secondary: '#7D756C',
		success: '#27a417',
		info: '#437cdfff',
		warning: '#e2c11bff',
		danger: '#e34555ff',

		// Grays
		gray100: '#FAF9F8',
		gray200: '#EFECE9',
		gray300: '#E6E2DE',
		gray400: '#DAD4CE',
		gray500: '#BDB5AD',
		gray600: '#7D756C',
		gray700: '#575049',
		gray800: '#44403C',
		gray900: '#292724',

		// Default
		white: '#FFFFFF',
		black: '#000000',
	},
	fonts: {
		h1: '4.0rem',
		h2: '3.2rem',
		h3: '2.8rem',
		h4: '2.4rem',
		h5: '2.0rem',
		h6: '1.6rem',
		display1: '7.2rem',
		display2: '6.4rem',
		display3: '5.8rem',
		display4: '5.2rem',
		body: '1.6rem',
		lead: '2.1rem',
		small: '1.4rem',
		xs: '1.2rem',
		xxs: '1.0rem',
		xxxs: '0.8rem',
	},
	fontWeights: {
		normal: 400,
		semiBold: 600,
		bold: 700,
		extraBold: 800,
	},
};
