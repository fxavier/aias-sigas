import { supabase } from '../supabaseClient';
import type { DocumentType, Document } from '../types';

// Document Types
export async function getDocumentTypes(): Promise<DocumentType[]> {
	const { data, error } = await supabase
		.from('document_types')
		.select('*')
		.order('name');

	if (error) throw error;
	return data as DocumentType[];
}

export async function createDocumentType(documentType: {
	name: string;
	description?: string;
}) {
	const { data, error } = await supabase
		.from('document_types')
		.insert([documentType])
		.select()
		.single();

	if (error) throw error;
	return data;
}

// Documents
export async function getDocuments() {
	const { data, error } = await supabase
		.from('documents')
		.select(
			`
      *,
      document_type:document_types(id, name)
    `
		)
		.order('creation_date', { ascending: false });

	if (error) {
		console.error('Error fetching documents:', error);
		throw error;
	}
	console.log('Documents fetched:', data);
	return data;
}

export async function getDocument(id: string): Promise<Document> {
	const { data, error } = await supabase
		.from('documents')
		.select(
			`
      *,
      document_type:document_types(id, name)
    `
		)
		.eq('id', Number(id))
		.single();

	if (error) throw error;
	return data as Document;
}

export async function createDocument(document: {
	code: string;
	creation_date: string;
	revision_date: string;
	document_name: string;
	document_type_id: string;
	document_path: string;
	document_state: 'REVISION' | 'INUSE' | 'OBSOLETE';
	retention_period: string;
	disposal_method: string;
	observation?: string;
}) {
	const { data, error } = await supabase
		.from('documents')
		.insert([document])
		.select(
			`
      *,
      document_type:document_types(id, name)
    `
		)
		.single();

	if (error) throw error;
	return data;
}

export async function updateDocument(
	id: string,
	document: Partial<{
		code: string;
		creation_date: string;
		revision_date: string;
		document_name: string;
		document_type_id: string;
		document_path: string;
		document_state: 'REVISION' | 'INUSE' | 'OBSOLETE';
		retention_period: string;
		disposal_method: string;
		observation?: string;
	}>
) {
	const { data, error } = await supabase
		.from('documents')
		.update(document)
		.eq('id', Number(id))
		.select(
			`
      *,
      document_type:document_types(id, name)
    `
		)
		.single();

	if (error) throw error;
	return data;
}

export async function deleteDocument(id: string) {
	const { error } = await supabase
		.from('documents')
		.delete()
		.eq('id', Number(id));

	if (error) throw error;
}
