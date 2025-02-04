import { supabase } from '../supabaseClient';
import type { Document, DocumentType } from '../types';

// Document Types
export async function getDocumentTypes(): Promise<DocumentType[]> {
	const { data, error } = await supabase
		.from('document_types')
		.select('*')
		.order('name');
	if (error) throw error;
	return data as DocumentType[];
}

// Documents
export async function getDocuments(): Promise<Document[]> {
	const { data, error } = await supabase
		.from('documents')
		.select('*')
		.order('creation_date', { ascending: false });
	if (error) throw error;
	return data as Document[];
}

export async function createDocument(
	document: Partial<Document>
): Promise<Document> {
	const { data, error } = await supabase
		.from('documents')
		.insert(document)
		.single();
	if (error) throw error;
	return data as Document;
}

export async function updateDocument(
	id: string,
	document: Partial<Document>
): Promise<Document> {
	const { data, error } = await supabase
		.from('documents')
		.update(document)
		.eq('id', id)
		.single();
	if (error) throw error;
	return data as Document;
}

export async function deleteDocument(id: string): Promise<void> {
	const { error } = await supabase.from('documents').delete().eq('id', id);
	if (error) throw error;
}
