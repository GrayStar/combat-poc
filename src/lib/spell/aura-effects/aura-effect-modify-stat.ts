import { MODIFY_TYPE_ID, ModifyStatEffectModel } from '@/lib/spell/spell-models';
import { AuraEffect } from '@/lib/spell/aura-effects/aura-effect';
import { STAT_TYPE_ID } from '@/lib/character/character-models';
import { Character } from '@/lib/character/character-class';

export abstract class AuraEffectModifyStat extends AuraEffect {
	protected readonly _modifyTypeId: MODIFY_TYPE_ID;
	protected readonly _statTypeId: STAT_TYPE_ID;
	protected readonly _value: number;

	constructor(config: ModifyStatEffectModel, character: Character) {
		super(character);

		this._modifyTypeId = config.modifyTypeId;
		this._statTypeId = config.statTypeId;
		this._value = config.value;
	}

	public abstract modifyStat(): void;
	public abstract revertStat(): void;
}
