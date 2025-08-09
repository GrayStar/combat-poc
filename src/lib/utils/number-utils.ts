import BigNumber from 'bignumber.js';

export const roundNumber = (value: number): number => {
	return new BigNumber(value).decimalPlaces(2, BigNumber.ROUND_DOWN).toNumber();
};

export function getRandomInt(min: number, max: number): number {
	const minCeil = Math.ceil(min);
	const maxFloor = Math.floor(max);
	return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}
