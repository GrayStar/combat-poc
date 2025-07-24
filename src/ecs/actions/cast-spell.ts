import { SpellEntity, SpellInstance } from '@/lib/instances';
import { SPELL_IDS } from '@/lib/models/spell-models';

export type SpellCasterComponents = {
	spells: SpellInstance[];
	isCasting: boolean;
	castTimeDuration?: number;
};

export type SpellCasterSystems = {
	setSpells(spellIds: SPELL_IDS[]): void;
	startCastAnimation(castTimeDuration: number, callback: () => void): void;
	stopCastAnimation(): void;
	castSpell(spellId: SPELL_IDS, targetId: string): void;
};

export type SpellCaster<T> = T & SpellCasterComponents & SpellCasterSystems;

export function spellCaster<T>(entity: T): SpellCaster<T> {
	let castAnimationTimeout: NodeJS.Timeout | undefined = undefined;

	return {
		...entity,

		// components
		spells: [],
		isCasting: false,
		castTimeDuration: undefined,

		// systems
		setSpells(spellIds: SPELL_IDS[]) {
			this.spells = spellIds.map((spellId) => SpellEntity(spellId));
		},
		startCastAnimation(castTimeDuration = 0, callback) {
			if (castAnimationTimeout) {
				return;
			}

			this.isCasting = true;
			this.castTimeDuration = castTimeDuration;

			castAnimationTimeout = setTimeout(() => {
				this.stopCastAnimation();
				callback();
			}, castTimeDuration);
		},
		stopCastAnimation() {
			if (castAnimationTimeout) {
				clearTimeout(castAnimationTimeout);

				this.isCasting = false;
				this.castTimeDuration = undefined;
				castAnimationTimeout = undefined;
			}
		},
		castSpell(spellId, targetId) {
			const spellOnActionBar = this.spells.find((s) => s.spellId === spellId);

			if (!spellOnActionBar) {
				console.log(`__ENTITY__ does not know ${spellId}.`);
				return;
			}

			// if (this.health <= 0) {
			// 	return;
			// }

			if (this.isCasting) {
				return;
			}

			if (spellOnActionBar.isCoolingDown || spellOnActionBar.isGloballyCoolingDown) {
				console.log(`__ENTITY__ cannot cast ${spellOnActionBar.title}, it is on cooldown.`);
				return;
			}

			console.log(targetId);

			// Create a castable instance of the spell and apply the caster's status effects
			// const spell = SpellEntity(spellId);
			//const spellWithStatusEffects = that.applyStatusEffectsToOutgoingSpell(spell);

			// const spellHealthCost = spellOnActionBar.casterEffects?.resources.health ?? 0;
			// const castersNextHealthValue = this.health + spellHealthCost;
			// if (castersNextHealthValue < 0) {
			// 	console.log(`__ENTITY__ cannot cast ${spellOnActionBar.title}, not enough health.`);
			// 	return;
			// }

			// const spellManaCost = spellOnActionBar.casterEffects?.resources.mana ?? 0;
			// const castersNextManaValue = this.mana + spellManaCost;
			// if (castersNextManaValue < 0) {
			// 	console.log(`__ENTITY__ cannot cast ${spellOnActionBar.title}, not enough mana.`);
			// 	return;
			// }

			// Find the target
			// const party = parties[entity.partyId];
			// const entities = party.getEntities();
			// const target = entities[targetId];

			// Determine the spells cast time duration
			// const castTime = spell.castTimeDurationInMs ?? 0;

			// If the spell has a cast time, trigger it, else cast it immediately
			// if (castTime > 0) {
			// 	this.startCastAnimation(castTime, castSpellWithStatusEffects);
			// } else {
			// 	castSpellWithStatusEffects();
			// }

			//function castSpellWithStatusEffects() {
			// Cooldown the spell
			// if (!spellWithStatusEffects.isStatusEffectDependency) {
			// 	entity.spells.forEach((s: SpellInstance) => {
			// 		if (s.spellId === spellId) {
			// 			s.cooldown(() => emitUpdate(entity));
			// 		} else {
			// 			s.globalCooldown(() => emitUpdate(entity));
			// 		}
			// 	});
			// }

			// Adjust the caster's resources
			//const healthAmount = get(spellWithStatusEffects, 'casterEffects.resources.health', 0);
			//const manaAmount = get(spellWithStatusEffects, 'casterEffects.resources.mana', 0);
			///that.adjustHealth(healthAmount);
			//that.adjustMana(manaAmount);

			// Apply the spell's status effects to the caster
			// TODO: STACKS/AMOUNT LOGIC
			// const casterStatusEffectsToAddById = get(
			// 	spellWithStatusEffects,
			// 	'casterEffects.statusEffectsToAddById',
			// 	[]
			// );
			// const casterStatusEffectsToRemoveById = get(
			// 	spellWithStatusEffects,
			// 	'casterEffects.statusEffectsToRemoveById',
			// 	[]
			// );
			// const casterStatusEffectsToRemoveByType = get(
			// 	spellWithStatusEffects,
			// 	'casterEffects.statusEffectsToRemoveByType',
			// 	[]
			// );
			// casterStatusEffectsToAddById.forEach((spellStatusEffect: SpellStatusEffect) => {
			// 	entity.getStatusEffect(spellStatusEffect.statusEffectId, entity);
			// });
			// casterStatusEffectsToRemoveById.forEach((spellStatusEffect: SpellStatusEffect) => {
			// 	entity.loseStatusEffect(spellStatusEffect.statusEffectId);
			// });
			// casterStatusEffectsToRemoveByType.forEach((spellStatusEffect: SpellStatusEffectType) => {
			// 	entity.loseStatusEffect(spellStatusEffect.typeId);
			// });

			// Summon familiars
			// const familiarsToSummon = get(spellWithStatusEffects, 'familiarsToSummon', []);
			// familiarsToSummon.forEach((familiarId: string) => {
			//     party.addFamiliar(familiarId, caster.id);
			// });

			// Have the target recieve the updated spell
			//target.recieveSpell(entity, target, spellWithStatusEffects);

			// emitUpdate(entity);
			//}
		},
	};
}
