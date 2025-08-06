import { ModifyStatEffectModel } from '@/lib/spell/spell-models';
import { Character } from '@/lib/character/character-class';
import { AuraEffectModifyStat } from '@/lib/spell/aura-effects/aura-effect-modify-stat';

export class AuraEffectModifyStatDecrease extends AuraEffectModifyStat {
	constructor(config: ModifyStatEffectModel, character: Character) {
		super(config, character);
	}

	public modifyStat() {
		const modifiedValue = this._character.stats[this._statTypeId] - this._value;
		this._character.setStat(this._statTypeId, modifiedValue);

		console.log(`${this._statTypeId} decreased to ${modifiedValue}`);
	}

	public revertStat() {
		const originalValue = this._character.stats[this._statTypeId] + this._value;
		this._character.setStat(this._statTypeId, originalValue);

		console.log(`${this._statTypeId} reverted to ${originalValue}`);
	}

	public getDescription() {
		return `${this._statTypeId} decreased by ${this._value}`;
	}
}
