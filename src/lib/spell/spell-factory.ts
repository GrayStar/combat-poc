import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { SPELL_TYPE_ID, spellData } from '@/lib/spell';

export type SpellInstance = ReturnType<typeof Spell>;

export const Spell = (spellTypeId: SPELL_TYPE_ID, notify: () => void) => {
	const spellConfig = cloneDeep(spellData[spellTypeId]);
	let cooldownTimeout: NodeJS.Timeout | undefined = undefined;

	return {
		...spellConfig,
		spellId: uuidv4(),
		isOnCooldown: false,
		stopCooldown() {
			if (!cooldownTimeout) {
				return;
			}

			clearTimeout(cooldownTimeout);
			cooldownTimeout = undefined;
			this.isOnCooldown = false;
			notify();
		},
		startCooldown() {
			this.stopCooldown();
			this.isOnCooldown = true;
			notify();

			cooldownTimeout = setTimeout(() => {
				this.isOnCooldown = false;
				notify();
			}, this.cooldownDurationInMs);
		},
	};
};
