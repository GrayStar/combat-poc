export type ManaAdjusterComponents = {
	readonly mana: number;
	readonly maxMana: number;
};

export type ManaAdjusterSystems = {
	getMana(): number;
	setMana(amount: number): void;
	getMaxMana(): number;
	setMaxMana(amount: number): void;
	adjustMana(amount: number): void;
};

export type ManaAdjuster = ManaAdjusterComponents & ManaAdjusterSystems;

export function manaAdjuster(maxManaValue: number): ManaAdjuster {
	let mana = maxManaValue;
	let maxMana = maxManaValue;

	const components: ManaAdjusterComponents = {
		get mana() {
			return mana;
		},
		get maxMana() {
			return maxMana;
		},
	};

	const systems: ManaAdjusterSystems = {
		getMana() {
			return mana;
		},
		setMana(amount) {
			mana = amount;
		},
		getMaxMana() {
			return maxMana;
		},
		setMaxMana(amount) {
			maxMana = amount;
		},
		adjustMana(amount) {
			const next = mana + amount;
			if (next <= 0) {
				mana = 0;
			} else {
				mana = Math.min(maxMana, next);
			}
		},
	};

	return {
		...components,
		...systems,
	};
}
