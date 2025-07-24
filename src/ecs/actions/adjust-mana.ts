export type ManaAdjusterComponents = {
	mana: number;
	maxMana: number;
};

export type ManaAdjusterSystems = {
	getMana(): number;
	setMana(amount: number): void;
	getMaxMana(): number;
	setMaxMana(amount: number): void;
	adjustMana(amount: number): void;
};

export type ManaAdjuster<T> = T & ManaAdjusterComponents & ManaAdjusterSystems;

export function manaAdjuster<T>(entity: T, maxManaValue: number): ManaAdjuster<T> {
	return {
		...entity,

		// components
		mana: maxManaValue,
		maxMana: maxManaValue,

		// systems
		getMana() {
			return this.mana;
		},
		setMana(amount: number) {
			this.mana = amount;
		},
		getMaxMana() {
			return this.maxMana;
		},
		setMaxMana(amount: number) {
			this.maxMana = amount;
		},
		adjustMana(amount: number) {
			const next = this.mana + amount;

			if (next <= 0) {
				this.mana = 0;

				return;
			}

			if (next >= this.maxMana) {
				this.mana = this.maxMana;
				return;
			}

			this.mana = next;
		},
	};
}
