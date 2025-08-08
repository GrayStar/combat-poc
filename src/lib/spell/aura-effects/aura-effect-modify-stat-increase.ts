import { AuraEffectModifyStat } from '@/lib/spell/aura-effects/aura-effect-modify-stat';

export class AuraEffectModifyStatIncrease extends AuraEffectModifyStat {
	public override modifyStat() {
		const modifiedValue = this._character.stats[this._statTypeId] + this._value;
		this._character.setStat(this._statTypeId, modifiedValue);
	}

	public override revertStat() {
		const originalValue = this._character.stats[this._statTypeId] - this._value;
		this._character.setStat(this._statTypeId, originalValue);

		console.log(`${this._statTypeId} reverted to ${originalValue}`);
	}

	public override getDescription() {
		return `${this._statTypeId} increased by ${this._value}`;
	}
}
