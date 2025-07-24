import { SpellEntity, SpellInstance } from '@/lib/instances';
import { SPELL_IDS } from '@/lib/models/spell-models';
import { HealthAdjuster } from './adjust-health';
import { ManaAdjuster } from './adjust-mana';

export type SpellCasterComponents = {
	spells: SpellInstance[];
	isCasting: boolean;
	castTimeDuration?: number;
};

export type SpellCasterSystems = {
	setSpells(spellIds: SPELL_IDS[]): void;
	startCastAnimation(castTimeDuration: number, callback: () => void): void;
	stopCastAnimation(): void;
	castSpell(spellId: SPELL_IDS): SpellInstance;
};

export type SpellCaster<T, K> = T & K & SpellCasterComponents & SpellCasterSystems;

export function spellCaster<T extends HealthAdjuster<K> & ManaAdjuster<K>, K>(entity: T): SpellCaster<T, K> {
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
		castSpell(spellId) {
			const entityKnowsSpell = !!this.spells.find((s) => s.spellId === spellId);

			if (!entityKnowsSpell) {
				throw new Error('entity does not know spell.');
			}

			if (this.health <= 0) {
				throw new Error('entity is dead.');
			}

			if (this.isCasting) {
				throw new Error('entity is busy.');
			}

			const spell = SpellEntity(spellId);

			const spellHealthCost = spell.casterEffects?.resources.health ?? 0;
			const castersNextHealthValue = this.health + spellHealthCost;
			if (castersNextHealthValue <= 0) {
				throw new Error('entity does not have enough health.');
			}

			const spellManaCost = spell.casterEffects?.resources.mana ?? 0;
			const castersNextManaValue = this.mana + spellManaCost;
			if (castersNextManaValue <= 0) {
				throw new Error('entity does not have enough mana.');
			}

			this.adjustHealth(spellHealthCost);
			this.adjustMana(spellManaCost);

			return spell;
		},
	};
}
