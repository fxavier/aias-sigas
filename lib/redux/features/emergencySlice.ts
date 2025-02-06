import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
	getIncidentReports,
	getIncidentReport,
	createIncidentReport,
	updateIncidentReport,
	deleteIncidentReport,
	uploadIncidentPhoto,
	deleteIncidentPhoto,
} from '@/lib/supabase/services/emergencyService';
import type { IncidentReport } from '@/lib/supabase/types';

interface EmergencyState {
	incidents: IncidentReport[];
	selectedIncident: IncidentReport | null;
	isLoading: boolean;
	error: string | null;
	uploadProgress: number;
}

const initialState: EmergencyState = {
	incidents: [],
	selectedIncident: null,
	isLoading: false,
	error: null,
	uploadProgress: 0,
};

export const fetchIncidents = createAsyncThunk(
	'emergency/fetchIncidents',
	async () => {
		const incidents = await getIncidentReports();
		return incidents;
	}
);

export const fetchIncident = createAsyncThunk(
	'emergency/fetchIncident',
	async (id: string) => {
		const incident = await getIncidentReport(id);
		return incident;
	}
);

export const addIncident = createAsyncThunk(
	'emergency/addIncident',
	async ({
		incident,
		photos,
	}: {
		incident: Omit<IncidentReport, 'id' | 'created_at' | 'updated_at'>;
		photos: Record<string, File>;
	}) => {
		// Upload photos first
		const photoUploads = await Promise.all(
			Object.entries(photos).map(async ([key, file]) => {
				const timestamp = new Date().getTime();
				const fileExt = file.name.split('.').pop();
				const path = `temp_${timestamp}_${key}.${fileExt}`;
				const uploadData = await uploadIncidentPhoto(file, path);
				return { key, path: uploadData.path };
			})
		);

		// Create photo paths object
		const photoPaths = photoUploads.reduce(
			(acc, { key, path }) => ({
				...acc,
				[key]: path,
			}),
			{}
		);

		// Create incident with photo paths
		const response = await createIncidentReport({
			...incident,
			...photoPaths,
		});

		return response;
	}
);

export const editIncident = createAsyncThunk(
	'emergency/editIncident',
	async ({
		id,
		incident,
		photos,
	}: {
		id: string;
		incident: Partial<IncidentReport>;
		photos?: Record<string, File>;
	}) => {
		let updatedPhotoPaths = {};

		if (photos) {
			// Delete old photos if they exist
			const incidentPhotoPaths = incident as Partial<Record<string, string>>;
			await Promise.all(
				Object.entries(photos).map(async ([key]) => {
					if (incidentPhotoPaths[key]) {
						await deleteIncidentPhoto(incidentPhotoPaths[key]);
					}
				})
			);

			// Upload new photos
			const photoUploads = await Promise.all(
				Object.entries(photos).map(async ([key, file]) => {
					const timestamp = new Date().getTime();
					const fileExt = file.name.split('.').pop();
					const path = `${
						(incident as IncidentReport).id
					}_${key}_${timestamp}.${fileExt}`;
					const uploadData = await uploadIncidentPhoto(file, path);
					return { key, path: uploadData.path };
				})
			);

			// Create photo paths object
			updatedPhotoPaths = photoUploads.reduce(
				(acc, { key, path }) => ({
					...acc,
					[key]: path,
				}),
				{}
			);
		}

		// Update incident with new photo paths
		const response = await updateIncidentReport(id, {
			...incident,
			...updatedPhotoPaths,
		});

		return response;
	}
);

export const removeIncident = createAsyncThunk(
	'emergency/removeIncident',
	async (id: string, { getState }) => {
		const state = getState() as { emergency: EmergencyState };
		const incident = state.emergency.incidents.find((inc) => inc.id === id);

		if (incident) {
			// Delete all photos
			const photoKeys: (keyof IncidentReport)[] = [
				'fotografia_frontal',
				'fotografia_posterior',
				'fotografia_lateral_direita',
				'fotografia_lateral_esquerda',
				'fotografia_do_melhor_angulo',
				'fotografia',
			];
			const incidentPhotos = incident as Record<keyof IncidentReport, string>;
			await Promise.all(
				photoKeys.map(async (key) => {
					if (incidentPhotos[key]) {
						await deleteIncidentPhoto(incidentPhotos[key]);
					}
				})
			);
		}

		await deleteIncidentReport(id);
		return id;
	}
);

const emergencySlice = createSlice({
	name: 'emergency',
	initialState,
	reducers: {
		setSelectedIncident: (state, action) => {
			state.selectedIncident = action.payload;
		},
		setUploadProgress: (state, action) => {
			state.uploadProgress = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIncidents.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchIncidents.fulfilled, (state, action) => {
				state.isLoading = false;
				state.incidents = action.payload;
			})
			.addCase(fetchIncidents.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to fetch incidents';
			})
			.addCase(fetchIncident.fulfilled, (state, action) => {
				state.selectedIncident = action.payload;
			})
			.addCase(addIncident.fulfilled, (state, action) => {
				state.incidents.unshift(action.payload);
				state.uploadProgress = 0;
			})
			.addCase(editIncident.fulfilled, (state, action) => {
				const index = state.incidents.findIndex(
					(inc) => inc.id === action.payload.id
				);
				if (index !== -1) {
					state.incidents[index] = action.payload;
				}
				state.uploadProgress = 0;
			})
			.addCase(removeIncident.fulfilled, (state, action) => {
				state.incidents = state.incidents.filter(
					(inc) => inc.id !== action.payload
				);
			});
	},
});

export const { setSelectedIncident, setUploadProgress } =
	emergencySlice.actions;
export default emergencySlice.reducer;
