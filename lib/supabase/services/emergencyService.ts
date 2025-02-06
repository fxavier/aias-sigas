import { supabase } from '@/lib/supabase/supabaseClient';
import type { IncidentReport } from '@/lib/supabase/types';

export async function getIncidentReports() {
	const { data, error } = await supabase
		.from('incident_reports')
		.select(
			`
      *,
      departments (
        id,
        name
      ),
      investigation_team (
        id,
        nome,
        empresa,
        actividade,
        data
      ),
      immediate_actions (
        id,
        accao,
        descricao,
        responsavel,
        data
      )
    `
		)
		.order('data', { ascending: false });

	if (error) throw error;
	return data;
}

export async function getIncidentReport(id: string) {
	const { data, error } = await supabase
		.from('incident_reports')
		.select(
			`
      *,
      departments (
        id,
        name
      ),
      investigation_team (
        id,
        nome,
        empresa,
        actividade,
        data
      ),
      immediate_actions (
        id,
        accao,
        descricao,
        responsavel,
        data
      )
    `
		)
		.eq('id', id)
		.single();

	if (error) throw error;
	return data;
}

export async function createIncidentReport(
	report: Omit<IncidentReport, 'id' | 'created_at' | 'updated_at'>
) {
	const { data, error } = await supabase
		.from('incident_reports')
		.insert([report])
		.select(
			`
      *,
      departments (
        id,
        name
      ),
      investigation_team (
        id,
        nome,
        empresa,
        actividade,
        data
      ),
      immediate_actions (
        id,
        accao,
        descricao,
        responsavel,
        data
      )
    `
		)
		.single();

	if (error) throw error;
	return data;
}

export async function updateIncidentReport(
	id: string,
	report: Partial<IncidentReport>
) {
	const { data, error } = await supabase
		.from('incident_reports')
		.update(report)
		.eq('id', id)
		.select(
			`
      *,
      departments (
        id,
        name
      ),
      investigation_team (
        id,
        nome,
        empresa,
        actividade,
        data
      ),
      immediate_actions (
        id,
        accao,
        descricao,
        responsavel,
        data
      )
    `
		)
		.single();

	if (error) throw error;
	return data;
}

export async function deleteIncidentReport(id: string) {
	const { error } = await supabase
		.from('incident_reports')
		.delete()
		.eq('id', id);

	if (error) throw error;
}

// File upload functions
export async function uploadIncidentPhoto(file: File, path: string) {
	const { data, error } = await supabase.storage
		.from('document-bucket/incident-photos')
		.upload(path, file, {
			cacheControl: '3600',
			upsert: false,
		});

	if (error) throw error;
	return data;
}

export async function deleteIncidentPhoto(path: string) {
	const { error } = await supabase.storage
		.from('document-bucket/incident-photos')
		.remove([path]);

	if (error) throw error;
}

export function getIncidentPhotoUrl(path: string) {
	const { data } = supabase.storage
		.from('document-bucket/incident-photos')
		.getPublicUrl(path);

	return data.publicUrl;
}
