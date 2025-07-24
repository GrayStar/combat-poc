import { v4 as uuidv4 } from 'uuid';

import { PlayerModel } from '@/lib/models';
import { playerData } from '@/lib/data';
import { healthAdjuster, spellCaster } from '@/ecs/actions';
import { manaAdjuster } from '../actions/adjust-mana';

interface PlayerComposite extends PlayerModel {
	readonly id: string;
}

export type PlayerInstance = ReturnType<typeof PlayerEntity>;

export const PlayerEntity = () => {
	const playerConfig = playerData;
	const playerComposite: PlayerComposite = {
		...playerConfig,
		id: uuidv4(),
	};

	const withHealth = healthAdjuster(playerComposite, playerComposite.maxHealth);
	const withMana = manaAdjuster(withHealth, withHealth.maxHealth);
	const withCast = spellCaster(withMana);

	return withCast;
};
