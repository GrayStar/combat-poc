import { SpellInstance } from '@/lib/instances';
import StatusEffect, { StatusEffectInstance } from '@/lib/instances/status-effect-instance';
import { STATUS_EFFECT_IDS } from '@/lib/models';

export type StatusEffectApplierComponents = {
	statusEffects: StatusEffectInstance[];
};

export type StatusEffectsApplierSystems = {
	getStatusEffect(statusEffectId: string): void;
	loseStatusEffect(statusEffect: string): void;
	applyStatusEffectsToIncomingSpell(spell: SpellInstance): SpellInstance;
	applyStatusEffectsToOutgoingSpell(spell: SpellInstance): SpellInstance;
};

export type StatusEffectsApplier<T> = T & StatusEffectApplierComponents & StatusEffectsApplierSystems;

export function statusEffectApplier<T>(entity: T): StatusEffectsApplier<T> {
	return {
		...entity,

		// components
		statusEffects: [],

		// systems
		getStatusEffect(statusEffectId: STATUS_EFFECT_IDS) {
			// Check if the status aready exists
			const statusEffectIndex = this.statusEffects.findIndex(
				(statusEffect) => statusEffect.statusEffectId === statusEffectId
			);

			// If status exists, reset its timeout
			if (statusEffectIndex > -1) {
				const statusEffectToReset = this.statusEffects[statusEffectIndex];

				statusEffectToReset.resetTimeout();
				statusEffectToReset.increaseResetCounter();
				// If status does not exist, create it and start its timeout
			} else {
				const statusEffect = StatusEffect(statusEffectId);

				console.log('status effect recieved:', statusEffect.title);

				statusEffect.setIntervalCallback(() => {
					statusEffect.intervalTickSpellIds.forEach((spellId) => {
						console.log('status effect tick...', spellId);
					});
				});

				statusEffect.setTimeoutCallback(() => {
					this.loseStatusEffect(statusEffect.id);
					statusEffect.timeoutExpireSpellIds.forEach((spellId) => {
						console.log('spellId timeout expire', spellId);
					});
				});

				statusEffect.startTimeout();
				this.statusEffects.push(statusEffect);
			}
		},
		loseStatusEffect(statusEffectId: string) {
			const statusEffectIndex: number = this.statusEffects.findIndex(
				(statusEffect) => statusEffect.id === statusEffectId
			);

			console.log('status effect lost at index', statusEffectIndex);

			this.statusEffects.splice(statusEffectIndex, 1);
		},
		applyStatusEffectsToIncomingSpell(spell: SpellInstance) {
			const updatedSpell = { ...spell };

			this.statusEffects.forEach((statusEffect: StatusEffectInstance) => {
				if (!statusEffect.incomingSpellModifiers.length) {
					return;
				}

				statusEffect.incomingSpellModifiers.forEach(() => {
					// TODO
					//const propertyToModify = modifier.property;
					//const originalValue = updatedSpell[property];
					//const updatedValue = modifier.equation(originalValue);
					//set(updatedSpell, propertyToModify, updatedValue);
				});
			});

			return updatedSpell;
		},
		applyStatusEffectsToOutgoingSpell(spell: SpellInstance) {
			const updatedSpell = { ...spell };

			this.statusEffects.forEach((statusEffect) => {
				if (!statusEffect.outgoingSpellModifiers.length) {
					return;
				}

				statusEffect.outgoingSpellModifiers.forEach(() => {
					// const propertyToModify: string = get(modifier, 'property');
					// const originalValue: number = get(updatedSpell, propertyToModify);
					// const updatedValue = modifier.equation(originalValue);
					// set(updatedSpell, propertyToModify, updatedValue);
				});
			});

			return updatedSpell;
		},
	};
}
