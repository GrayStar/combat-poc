export type HealthAdjusterComponents = {
	health: number;
	maxHealth: number;
};

export type HealthAdjusterSystems = {
	getHealth(): number;
	setHealth(amount: number): void;
	getMaxHealth(): number;
	setMaxHealth(amount: number): void;
	adjustHealth(amount: number): void;
};

export type HealthAdjuster<T> = T & HealthAdjusterComponents & HealthAdjusterSystems;

export function healthAdjuster<T>(entity: T, maxHealthValue: number): HealthAdjuster<T> {
	return {
		...entity,

		// components
		health: maxHealthValue,
		maxHealth: maxHealthValue,

		// systems
		getHealth() {
			return this.health;
		},
		setHealth(amount: number) {
			this.health = amount;
		},
		getMaxHealth() {
			return this.maxHealth;
		},
		setMaxHealth(amount: number) {
			this.maxHealth = amount;
		},
		adjustHealth(amount: number) {
			const next = this.health + amount;

			if (next <= 0) {
				this.health = 0;
				// [TODO]: a die action?
				// this.die?.();
				return;
			}

			if (next >= this.maxHealth) {
				this.health = this.maxHealth;
				return;
			}

			this.health = next;
		},
	};
}
