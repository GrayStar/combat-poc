import BigNumber from 'bignumber.js';

export const roundNumber = (value: number): number => {
	return new BigNumber(value).decimalPlaces(2, BigNumber.ROUND_DOWN).toNumber();
};
