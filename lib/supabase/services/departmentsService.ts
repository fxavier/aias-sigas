import { supabase } from '@/lib/supabase/supabaseClient';
//import type { Department } from '@/lib/supabase/types';

export async function getDepartments() {
	const { data, error } = await supabase
		.from('departments')
		.select('*')
		.order('name');

	if (error) throw error;
	return data;
}

export async function getDepartment(id: string) {
	const { data, error } = await supabase
		.from('departments')
		.select('*')
		.eq('id', id)
		.single();

	if (error) throw error;
	return data;
}

export async function createDepartment(department: {
	name: string;
	description: string;
}) {
	const { data, error } = await supabase
		.from('departments')
		.insert([department])
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function updateDepartment(
	id: string,
	department: Partial<{
		name: string;
		description: string;
	}>
) {
	const { data, error } = await supabase
		.from('departments')
		.update(department)
		.eq('id', id)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function deleteDepartment(id: string) {
	const { error } = await supabase.from('departments').delete().eq('id', id);

	if (error) throw error;
}
