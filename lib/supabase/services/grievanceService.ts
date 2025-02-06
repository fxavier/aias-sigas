import { supabase } from '@/lib/supabase/supabaseClient';
//import type { WorkerGrievance } from '@/supabase/types/workerGrievance';

export async function getWorkerGrievances() {
	const { data, error } = await supabase
		.from('worker_grievance')
		.select('*')
		.order('date', { ascending: false });

	if (error) throw error;
	return data;
}

export async function getWorkerGrievancesByStatus(
	status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
) {
	const { data, error } = await supabase
		.from('worker_grievance')
		.select('*')
		.eq('status', status)
		.order('date', { ascending: false });

	if (error) throw error;
	return data;
}

export async function getWorkerGrievance(id: string) {
	const { data, error } = await supabase
		.from('worker_grievance')
		.select('*')
		.eq('id', id)
		.single();

	if (error) throw error;
	return data;
}

export async function createWorkerGrievance(grievance: {
	name: string;
	company: string;
	date: string;
	prefered_contact_method: 'EMAIL' | 'PHONE' | 'FACE_TO_FACE';
	contact: string;
	prefered_language: 'PORTUGUESE' | 'ENGLISH' | 'OTHER';
	other_language?: string;
	grievance_details: string;
	unique_identification_of_company_acknowlegement: string;
	name_of_person_acknowledging_grievance: string;
	position_of_person_acknowledging_grievance: string;
	date_of_acknowledgement: string;
	signature_of_person_acknowledging_grievance: string;
	follow_up_details: string;
	signature_of_response_corrective_action_person: string;
	acknowledge_receipt_of_response: string;
	name_of_person_acknowledging_response: string;
	signature_of_person_acknowledging_response: string;
	date_of_acknowledgement_response: string;
}) {
	const { data, error } = await supabase
		.from('worker_grievance')
		.insert([
			{
				...grievance,
				status: 'PENDING',
			},
		])
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function updateWorkerGrievance(
	id: string,
	grievance: Partial<{
		name: string;
		company: string;
		date: string;
		prefered_contact_method: 'EMAIL' | 'PHONE' | 'FACE_TO_FACE';
		contact: string;
		prefered_language: 'PORTUGUESE' | 'ENGLISH' | 'OTHER';
		other_language?: string;
		grievance_details: string;
		status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
		unique_identification_of_company_acknowlegement: string;
		name_of_person_acknowledging_grievance: string;
		position_of_person_acknowledging_grievance: string;
		date_of_acknowledgement: string;
		signature_of_person_acknowledging_grievance: string;
		follow_up_details: string;
		closed_out_date?: string;
		signature_of_response_corrective_action_person: string;
		acknowledge_receipt_of_response: string;
		name_of_person_acknowledging_response: string;
		signature_of_person_acknowledging_response: string;
		date_of_acknowledgement_response: string;
	}>
) {
	const { data, error } = await supabase
		.from('worker_grievance')
		.update(grievance)
		.eq('id', id)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function updateGrievanceStatus(
	id: string,
	status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
) {
	const { data, error } = await supabase
		.from('worker_grievance')
		.update({
			status,
			...(status === 'COMPLETED'
				? { closed_out_date: new Date().toISOString() }
				: {}),
		})
		.eq('id', id)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function deleteWorkerGrievance(id: string) {
	const { error } = await supabase
		.from('worker_grievance')
		.delete()
		.eq('id', id);

	if (error) throw error;
}

export async function searchWorkerGrievances(query: string) {
	const { data, error } = await supabase
		.from('worker_grievance')
		.select('*')
		.or(
			`
      name.ilike.%${query}%,
      company.ilike.%${query}%,
      grievance_details.ilike.%${query}%
    `
		)
		.order('date', { ascending: false });

	if (error) throw error;
	return data;
}

export async function getGrievanceStatistics() {
	const { data: total, error: totalError } = await supabase
		.from('worker_grievance')
		.select('status', { count: 'exact' });

	const { data: pending, error: pendingError } = await supabase
		.from('worker_grievance')
		.select('id', { count: 'exact' })
		.eq('status', 'PENDING');

	const { data: inProgress, error: inProgressError } = await supabase
		.from('worker_grievance')
		.select('id', { count: 'exact' })
		.eq('status', 'IN_PROGRESS');

	const { data: completed, error: completedError } = await supabase
		.from('worker_grievance')
		.select('id', { count: 'exact' })
		.eq('status', 'COMPLETED');

	if (totalError || pendingError || inProgressError || completedError) {
		throw new Error('Failed to fetch grievance statistics');
	}

	return {
		total: total?.length || 0,
		pending: pending?.length || 0,
		inProgress: inProgress?.length || 0,
		completed: completed?.length || 0,
	};
}
