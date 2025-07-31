import { v4 as uuidv4 } from 'uuid';
import { SpellEffectApplyAura } from '@/lib/spell/spell-models';

export class Aura {
	public readonly auraId: string;
	public readonly title: string;
	public readonly auraConfigs: SpellEffectApplyAura[];

	constructor(
		auraTitle: string,
		auraConfigs: SpellEffectApplyAura[],
		private readonly intervalCallback: (statusEffectId: string) => void,
		private readonly timeoutCallback: (statusEffectId: string) => void
	) {
		this.auraId = uuidv4();
		this.title = auraTitle;
		this.auraConfigs = auraConfigs;
	}
}
