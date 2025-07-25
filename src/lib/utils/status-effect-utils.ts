import { v4 as uuidv4 } from 'uuid';
import { StatusEffectInstance, StatusEffectModel } from '@/lib/models';

export const getStatusEffectInstance = (statusEffect: StatusEffectModel): StatusEffectInstance => {
	return {
		...statusEffect,
		statusEffectId: uuidv4(),
	};
};
