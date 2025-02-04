import { supabase } from '../supabaseClient';
import type { Document, DocumentType } from '../types';

// ---------------------
// Database Functions
// ---------------------

export async function getDocumentTypes(): Promise<DocumentType[]> {
	const { data, error } = await supabase
		.from('document_types')
		.select('*')
		.order('name');
	if (error) throw error;
	return data as DocumentType[];
}

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

// ---------------------
// File Storage Functions
// ---------------------

const BUCKET = 'document-bucket';

/**
 * Uploads a file to Supabase Storage.
 *
 * This function generates a unique filename, sets the correct content type,
 * and calls the provided progress callback (if needed). Note that the Supabase
 * client does not natively support upload progress events so we simply call
 * the callback at the start and the end of the upload.
 *
 * @param file The file to be uploaded.
 * @param onProgress A callback to update upload progress.
 * @returns An object with the file path (within the bucket).
 */
export async function uploadFileWithProgress(
	file: File,
	onProgress: (progress: number) => void
): Promise<{ path: string }> {
	// Signal the beginning of the upload
	onProgress(0);

	// Create a unique filename using the browser's crypto API.
	const fileExt = file.name.split('.').pop();
	const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`;
	const filePath = uniqueFileName; // You can also use folders (e.g., `documents/${uniqueFileName}`)

	// Upload the file with proper options
	const { data, error } = await supabase.storage
		.from(BUCKET)
		.upload(filePath, file, {
			cacheControl: '3600',
			upsert: true, // Change to false if you want to prevent overwrites
			contentType: file.type,
		});

	if (error) {
		console.error('Upload error:', error);
		throw error;
	}

	// Signal the end of the upload
	onProgress(100);

	// data.path contains the path of the uploaded file inside the bucket
	return { path: data.path };
}

/**
 * Deletes a file from Supabase Storage.
 *
 * @param path The file path to be deleted.
 */
export async function deleteFile(path: string): Promise<void> {
	const { error } = await supabase.storage.from(BUCKET).remove([path]);
	if (error) {
		console.error('Delete file error:', error);
		throw error;
	}
}

/**
 * Gets the public URL for a file stored in the bucket.
 *
 * @param path The file path within the bucket.
 * @returns The public URL string.
 */
export function getPublicUrl(path: string): string {
	const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
	return data.publicUrl;
}
