// export const addStatusEffectTypeIdToCharacter = (
// 	character: Character,
// 	statusEffectTypeId: STATUS_EFFECT_TYPE_ID
// ) => {
// 	const statusEffectInstance = new StatusEffect(statusEffectTypeId);

// 	if (statusEffectInstance.canStack) {
// 		statusEffectInstance.stacks = 1;
// 	}

// 	const matchingStatusEffect = Object.values(character.statusEffects).find(
// 		(se) => se.statusEffectTypeId === statusEffectInstance.statusEffectTypeId
// 	);

// 	if (matchingStatusEffect) {
// 		const stacks = (matchingStatusEffect.stacks ?? 0) + 1;

// 		if (statusEffectInstance.canStack) {
// 			statusEffectInstance.stacks = stacks;
// 		}

// 		delete character.statusEffects[matchingStatusEffect.statusEffectId];
// 	}

// 	character.statusEffects = {
// 		...character.statusEffects,
// 		[statusEffectInstance.statusEffectId]: statusEffectInstance,
// 	};
// };

// export const removeStatusEffectTypeIdFromCharacter = (
// 	character: CharacterInstance,
// 	statusEffectTypeId: STATUS_EFFECT_TYPE_ID
// ) => {
// 	console.group('removeStatusEffectFromCharacter');
// 	console.log('character', character);
// 	console.log('statusEffectTypeId', statusEffectTypeId);
// 	console.groupEnd();
// };
