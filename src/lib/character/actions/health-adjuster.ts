export type HealthAdjusterComponents = {
	health: number;
	maxHealth: number;
};

export type HealthAdjusterSystems = {
	setHealth(amount: number): void;
	setMaxHealth(amount: number): void;
	adjustHealth(amount: number): void;
};

export type HealthAdjuster = HealthAdjusterComponents & HealthAdjusterSystems;

export function healthAdjuster(maxHealthValue: number): HealthAdjuster {
	return {
		health: maxHealthValue,
		maxHealth: maxHealthValue,
		setHealth(amount: number) {
			this.health = amount;
		},
		setMaxHealth(amount: number) {
			this.maxHealth = amount;
		},
		adjustHealth(amount: number) {
			const next = this.health + amount;
			if (next <= 0) {
				this.health = 0;
			} else {
				this.health = Math.min(this.maxHealth, next);
			}
		},
	};
}
