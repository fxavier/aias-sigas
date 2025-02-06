import { supabase } from '@/lib/supabase/supabaseClient';

// Non-Compliance Records
export async function getNonComplianceRecords() {
	const { data, error } = await supabase
		.from('claim_non_compliance_control')
		.select(
			`
      *,
      departments (
        id,
        name
      )
    `
		)
		.order('created_at', { ascending: false });

	if (error) throw error;
	return data;
}

export async function createNonComplianceRecord(
	record: Record<string, unknown>
) {
	const { data, error } = await supabase
		.from('claim_non_compliance_control')
		.insert([record])
		.select(
			`
      *,
      departments (
        id,
        name
      )
    `
		)
		.single();

	if (error) throw error;
	return data;
}

export async function updateNonComplianceRecord(
	id: string,
	record: Record<string, unknown>
) {
	const { data, error } = await supabase
		.from('claim_non_compliance_control')
		.update(record)
		.eq('id', id)
		.select(
			`
      *,
      departments (
        id,
        name
      )
    `
		)
		.single();

	if (error) throw error;
	return data;
}

export async function deleteNonComplianceRecord(id: string) {
	const { error } = await supabase
		.from('claim_non_compliance_control')
		.delete()
		.eq('id', id);

	if (error) throw error;
}

// Complain Controls
export async function getComplainControls() {
	const { data, error } = await supabase
		.from('claim_complain_control')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) throw error;
	return data;
}

export async function createComplainControl(record: Record<string, unknown>) {
	const { data, error } = await supabase
		.from('claim_complain_control')
		.insert([record])
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function updateComplainControl(
	id: string,
	record: Record<string, unknown>
) {
	const { data, error } = await supabase
		.from('claim_complain_control')
		.update(record)
		.eq('id', id)
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function deleteComplainControl(id: string) {
	const { error } = await supabase
		.from('claim_complain_control')
		.delete()
		.eq('id', id);

	if (error) throw error;
}

// Complaint Records
export async function getComplaintRecords() {
	const { data, error } = await supabase
		.from('complaint_and_claim_record')
		.select(
			`
      *,
      photo_document_proving_closure (
        id,
        photo,
        document
      )
    `
		)
		.order('created_at', { ascending: false });

	if (error) throw error;
	return data;
}

export async function createComplaintRecord(record: Record<string, unknown>) {
	const { data, error } = await supabase
		.from('complaint_and_claim_record')
		.insert([record])
		.select(
			`
      *,
      photo_document_proving_closure (
        id,
        photo,
        document
      )
    `
		)
		.single();

	if (error) throw error;
	return data;
}

export async function updateComplaintRecord(
	id: string,
	record: Record<string, unknown>
) {
	const { data, error } = await supabase
		.from('complaint_and_claim_record')
		.update(record)
		.eq('id', id)
		.select(
			`
      *,
      photo_document_proving_closure (
        id,
        photo,
        document
      )
    `
		)
		.single();

	if (error) throw error;
	return data;
}

export async function deleteComplaintRecord(id: string) {
	const { error } = await supabase
		.from('complaint_and_claim_record')
		.delete()
		.eq('id', id);

	if (error) throw error;
}

// Photo Document Proving Closure
export async function uploadPhotoDocument(file: File, path: string) {
	const { data, error } = await supabase.storage
		.from('complaint-photos')
		.upload(path, file, {
			cacheControl: '3600',
			upsert: false,
		});

	if (error) throw error;
	return data;
}

export async function deletePhotoDocument(path: string) {
	const { error } = await supabase.storage
		.from('complaint-photos')
		.remove([path]);

	if (error) throw error;
}

export function getPhotoDocumentUrl(path: string) {
	const { data } = supabase.storage.from('complaint-photos').getPublicUrl(path);

	return data.publicUrl;
}
