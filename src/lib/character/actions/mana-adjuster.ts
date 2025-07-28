export type ManaAdjusterComponents = {
	mana: number;
	maxMana: number;
};

export type ManaAdjusterSystems = {
	setMana(amount: number): void;
	setMaxMana(amount: number): void;
	adjustMana(amount: number): void;
};

export type ManaAdjuster = ManaAdjusterComponents & ManaAdjusterSystems;

export function manaAdjuster(maxManaValue: number): ManaAdjuster {
	return {
		mana: maxManaValue,
		maxMana: maxManaValue,
		setMana(amount) {
			this.mana = amount;
		},
		setMaxMana(amount) {
			this.maxMana = amount;
		},
		adjustMana(amount) {
			const next = this.mana + amount;
			this.mana = next <= 0 ? 0 : Math.min(this.maxMana, next);
		},
	};
}
