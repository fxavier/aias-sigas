import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DocumentType } from '@/lib/supabase/types';
import { getDocumentTypes } from '@/lib/supabase/services/documentService';

interface DocumentTypesState {
	documentTypes: DocumentType[];
	loading: boolean;
	error: string | null;
}

const initialState: DocumentTypesState = {
	documentTypes: [],
	loading: false,
	error: null,
};

export const fetchDocumentTypes = createAsyncThunk(
	'documentTypes/fetchDocumentTypes',
	async () => {
		const types = await getDocumentTypes();
		return types;
	}
);

const documentTypesSlice = createSlice({
	name: 'documentTypes',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchDocumentTypes.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDocumentTypes.fulfilled, (state, action) => {
				state.documentTypes = action.payload;
				state.loading = false;
			})
			.addCase(fetchDocumentTypes.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Error fetching document types';
			});
	},
});

export default documentTypesSlice.reducer;
