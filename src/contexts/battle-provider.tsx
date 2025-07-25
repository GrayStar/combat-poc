import { cloneDeep } from 'lodash';
import { PropsWithChildren, useState } from 'react';
import { BattleInstance, BattleModel, SPELL_TYPE_ID } from '@/lib/models';
import { BattleContext } from '@/contexts';
import { getBattleInstance, getSpellInstance } from '@/lib/utils';
import { spellData } from '@/lib/data';

export const BattleProvider = ({ children }: PropsWithChildren) => {
	const [battle, setBattle] = useState<BattleInstance>();
	const [combatLog] = useState<string[]>([]);

	const startBattle = (battle: BattleModel) => {
		setBattle(getBattleInstance(battle));
	};

	const handleCastSpell = async ({
		casterId,
		targetId,
		spellTypeId,
	}: {
		casterId: string;
		targetId: string;
		spellTypeId: SPELL_TYPE_ID;
	}) => {
		const allCharacters = {
			...battle?.friendlyCharacters,
			...battle?.hostileCharacters,
		};

		const caster = cloneDeep(allCharacters[casterId]);
		const target = cloneDeep(allCharacters[targetId]);
		const casterKnowsSpell = !!Object.values(caster.spells).find((spell) => spell.spellTypeId === spellTypeId);
		const spellConfig = spellData[spellTypeId];
		const spell = getSpellInstance(spellConfig);
		// TODO: run spell through function that applies caster statusEffects to it.
		const spellWithCasterStatusEffects = cloneDeep(spell);

		if (caster.health <= 0) {
			console.log(`${caster.title} is dead.`);
			return;
		}

		if (caster.isCasting) {
			console.log(`${caster.title} is busy.`);
			return;
		}

		if (!casterKnowsSpell) {
			console.log(`${caster.title} does not know ${spell.title}.`);
			return;
		}

		const spellHealthCost = spellWithCasterStatusEffects.casterEffects?.resources?.health ?? 0;
		const castersNextHealthValue = caster.health + spellHealthCost;
		if (castersNextHealthValue <= 0) {
			console.log(`${caster.title} does not have enough health.`);
			return;
		}

		const spellManaCost = spellWithCasterStatusEffects.casterEffects?.resources?.mana ?? 0;
		const castersNextManaValue = caster.mana + spellManaCost;
		if (castersNextManaValue <= 0) {
			console.log(`${caster.title} does not have enough mana.`);
			return;
		}

		const spellCastDurationInMs = spellWithCasterStatusEffects.castTimeDurationInMs ?? 0;
		if (spellCastDurationInMs > 0) {
			console.log('animation for casting');
			// Todo: animate casting?
		} else {
			console.log('cast spell with status effects?');
		}

		console.log('caster:', caster);
		console.log('target:', target);
		console.log('spellWithCasterStatusEffects', spellWithCasterStatusEffects);
	};

	const value = {
		startBattle,
		battle,
		handleCastSpell,
		combatLog,
	};

	return <BattleContext.Provider value={value}>{children}</BattleContext.Provider>;
};
