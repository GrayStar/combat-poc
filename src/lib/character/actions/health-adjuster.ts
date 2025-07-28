export type HealthAdjusterComponents = {
	readonly health: number;
	readonly maxHealth: number;
};

export type HealthAdjusterSystems = {
	getHealth(): number;
	setHealth(amount: number): void;
	getMaxHealth(): number;
	setMaxHealth(amount: number): void;
	adjustHealth(amount: number): void;
};

export type HealthAdjuster = HealthAdjusterComponents & HealthAdjusterSystems;

export function healthAdjuster(maxHealthValue: number): HealthAdjuster {
	let health = maxHealthValue;
	let maxHealth = maxHealthValue;

	const components: HealthAdjusterComponents = {
		get health() {
			return health;
		},
		get maxHealth() {
			return maxHealth;
		},
	};

	const systems: HealthAdjusterSystems = {
		getHealth() {
			return health;
		},
		setHealth(amount: number) {
			health = amount;
		},
		getMaxHealth() {
			return maxHealth;
		},
		setMaxHealth(amount: number) {
			maxHealth = amount;
		},
		adjustHealth(amount: number) {
			const next = health + amount;
			if (next <= 0) {
				health = 0;
			} else {
				health = Math.min(maxHealth, next);
			}
		},
	};

	return {
		...components,
		...systems,
	};
}
