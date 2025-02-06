import { supabase } from '@/lib/supabase/supabaseClient';
import type { StrategicObjective, SpecificObjective } from '../types';

// Strategic Objectives
export async function getStrategicObjectives() {
	const { data, error } = await supabase
		.from('strategic_objectives')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) throw error;
	return data;
}

export async function getStrategicObjective(id: string) {
	const { data, error } = await supabase
		.from('strategic_objectives')
		.select('*')
		.eq('id', id)
		.single();

	if (error) throw error;
	return data;
}

export async function createStrategicObjective(
	objective: Omit<StrategicObjective, 'id' | 'created_at' | 'updated_at'>
) {
	const { data, error } = await supabase
		.from('strategic_objectives')
		.insert([objective])
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function updateStrategicObjective(
	id: string,
	objective: Partial<StrategicObjective>
) {
	const { data, error } = await supabase
		.from('strategic_objectives')
		.update(objective)
		.eq('id', id)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function deleteStrategicObjective(id: string) {
	const { error } = await supabase
		.from('strategic_objectives')
		.delete()
		.eq('id', id);

	if (error) throw error;
}

// Specific Objectives
export async function getSpecificObjectives() {
	const { data, error } = await supabase
		.from('specific_objectives')
		.select('*')
		.order('deadline', { ascending: true });

	if (error) throw error;
	return data;
}

export async function getSpecificObjective(id: string) {
	const { data, error } = await supabase
		.from('specific_objectives')
		.select('*')
		.eq('id', id)
		.single();

	if (error) throw error;
	return data;
}

export async function createSpecificObjective(
	objective: Omit<SpecificObjective, 'id' | 'created_at' | 'updated_at'>
) {
	const { data, error } = await supabase
		.from('specific_objectives')
		.insert([objective])
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function updateSpecificObjective(
	id: string,
	objective: Partial<SpecificObjective>
) {
	const { data, error } = await supabase
		.from('specific_objectives')
		.update(objective)
		.eq('id', id)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function deleteSpecificObjective(id: string) {
	const { error } = await supabase
		.from('specific_objectives')
		.delete()
		.eq('id', id);

	if (error) throw error;
}
