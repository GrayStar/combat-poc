import { v4 as uuidv4 } from 'uuid';
import { SpellEffectApplyAura } from '@/lib/spell/spell-models';

export type AuraState = {
	auraId: string;
	title: string;
	description: string;
};

export class Aura {
	public readonly auraId: string;
	public readonly title: string;
	public readonly spellEffects: SpellEffectApplyAura[];

	constructor(
		config: {
			auraTitle: string;
			spellEffects: SpellEffectApplyAura[];
		},
		readonly intervalCallback: (statusEffectId: string) => void,
		readonly timeoutCallback: (statusEffectId: string) => void
	) {
		this.auraId = uuidv4();
		this.title = config.auraTitle;
		this.spellEffects = config.spellEffects;
	}

	public getState(): AuraState {
		return {
			auraId: this.auraId,
			title: this.title,
			description: '[ToDo]: aura description',
		};
	}
}
