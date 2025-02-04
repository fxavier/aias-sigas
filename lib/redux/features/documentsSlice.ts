import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
	getDocuments,
	getDocumentTypes,
	createDocument,
	updateDocument,
	deleteDocument as deleteDocumentService,
} from '@/lib/supabase/services/documentService';
import type { Document, DocumentType } from '@/lib/supabase/types';
import * as storageService from '@/lib/supabase/services/storageService';

interface DocumentsState {
	documents: Document[];
	documentTypes: DocumentType[];
	isLoading: boolean;
	error: string | null;
	selectedDocument: Document | null;
	fileUploadProgress: number;
}

const initialState: DocumentsState = {
	documents: [],
	documentTypes: [],
	isLoading: false,
	error: null,
	selectedDocument: null,
	fileUploadProgress: 0,
};

export const fetchDocuments = createAsyncThunk(
	'documents/fetchDocuments',
	async () => {
		const [documents, documentTypes] = await Promise.all([
			getDocuments(),
			getDocumentTypes(),
		]);
		return { documents, documentTypes };
	}
);

export const addDocument = createAsyncThunk(
	'documents/addDocument',
	async (
		document: Partial<Document> & { file?: File },
		{ dispatch, rejectWithValue }
	) => {
		if (document.file) {
			try {
				const { path } = await storageService.uploadFileWithProgress(
					document.file,
					(progress) => {
						dispatch(setFileUploadProgress(progress));
					}
				);
				// Save the file path into the document record
				document.document_path = path;
				// Optionally, you might store the public URL as well
				delete document.file;
			} catch (error: unknown) {
				let errorMessage = 'An unknown error occurred';
				if (error instanceof Error) {
					errorMessage = error.message;
				}
				return rejectWithValue(errorMessage);
			}
		}
		const newDoc = await createDocument(document);
		return newDoc;
	}
);

export const editDocument = createAsyncThunk(
	'documents/editDocument',
	async (
		{
			id,
			document,
		}: { id: string; document: Partial<Document> & { file?: File } },
		{ dispatch, rejectWithValue, getState }
	) => {
		// Check if a new file is provided
		if (document.file) {
			// Retrieve the current document to get the existing file path
			const state = getState() as { documents: DocumentsState };
			const currentDoc = state.documents.documents.find((doc) => doc.id === id);
			if (currentDoc && currentDoc.document_path) {
				try {
					await storageService.deleteFile(currentDoc.document_path);
				} catch (error) {
					console.error('Error deleting old file:', error);
				}
			}
			// Upload the new file
			try {
				const { path } = await storageService.uploadFileWithProgress(
					document.file,
					(progress) => {
						dispatch(setFileUploadProgress(progress));
					}
				);
				document.document_path = path;
				delete document.file;
			} catch (error: unknown) {
				let errorMessage = 'An unknown error occurred';
				if (error instanceof Error) {
					errorMessage = error.message;
				}
				return rejectWithValue(errorMessage);
			}
		}
		const updatedDoc = await updateDocument(id, document);
		return updatedDoc;
	}
);

/**
 * Delete a document.
 * Also delete its associated file from storage if it exists.
 */
export const deleteDocument = createAsyncThunk(
	'documents/deleteDocument',
	async (id: string, { getState }) => {
		const state = getState() as { documents: DocumentsState };
		const currentDoc = state.documents.documents.find((doc) => doc.id === id);
		if (currentDoc && currentDoc.document_path) {
			try {
				await storageService.deleteFile(currentDoc.document_path);
			} catch (error) {
				console.error('Error deleting file:', error);
			}
		}
		await deleteDocumentService(id);
		return id;
	}
);

const documentsSlice = createSlice({
	name: 'documents',
	initialState,
	reducers: {
		setSelectedDocument: (state, action: PayloadAction<Document | null>) => {
			state.selectedDocument = action.payload;
		},
		setFileUploadProgress: (state, action: PayloadAction<number>) => {
			state.fileUploadProgress = action.payload;
		},
		resetFileUploadProgress: (state) => {
			state.fileUploadProgress = 0;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchDocuments.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchDocuments.fulfilled, (state, action) => {
				state.isLoading = false;
				state.documents = action.payload.documents;
				state.documentTypes = action.payload.documentTypes;
			})
			.addCase(fetchDocuments.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to fetch documents';
			})
			.addCase(addDocument.fulfilled, (state, action) => {
				state.documents.unshift(action.payload);
				state.fileUploadProgress = 0;
			})
			.addCase(editDocument.fulfilled, (state, action) => {
				const index = state.documents.findIndex(
					(doc) => doc.id === action.payload.id
				);
				if (index !== -1) {
					state.documents[index] = action.payload;
				}
				state.fileUploadProgress = 0;
			})
			.addCase(deleteDocument.fulfilled, (state, action) => {
				state.documents = state.documents.filter(
					(doc) => doc.id !== action.payload
				);
			});
	},
});

export const {
	setSelectedDocument,
	setFileUploadProgress,
	resetFileUploadProgress,
} = documentsSlice.actions;
export default documentsSlice.reducer;
