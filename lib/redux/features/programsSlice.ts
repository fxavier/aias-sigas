import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
	getStrategicObjectives,
	createStrategicObjective,
	updateStrategicObjective,
	deleteStrategicObjective,
	getSpecificObjectives,
	createSpecificObjective,
	updateSpecificObjective,
	deleteSpecificObjective,
} from '@/lib/supabase/services/objectivesService';
import type {
	StrategicObjective,
	SpecificObjective,
} from '@/lib/supabase/types';

interface ProgramsState {
	strategicObjectives: StrategicObjective[];
	specificObjectives: SpecificObjective[];
	isLoading: boolean;
	error: string | null;
	selectedObjective: StrategicObjective | SpecificObjective | null;
}

const initialState: ProgramsState = {
	strategicObjectives: [],
	specificObjectives: [],
	isLoading: false,
	error: null,
	selectedObjective: null,
};

// Strategic Objectives
export const fetchStrategicObjectives = createAsyncThunk(
	'programs/fetchStrategicObjectives',
	async () => {
		const objectives = await getStrategicObjectives();
		return objectives;
	}
);

export const addStrategicObjective = createAsyncThunk(
	'programs/addStrategicObjective',
	async (objective: {
		description: string;
		goals: string;
		strategies_for_achievement: string;
	}) => {
		const response = await createStrategicObjective(objective);
		return response;
	}
);

export const editStrategicObjective = createAsyncThunk(
	'programs/editStrategicObjective',
	async ({
		id,
		objective,
	}: {
		id: string;
		objective: Partial<{
			description: string;
			goals: string;
			strategies_for_achievement: string;
		}>;
	}) => {
		const response = await updateStrategicObjective(id, objective);
		return response;
	}
);

export const removeStrategicObjective = createAsyncThunk(
	'programs/removeStrategicObjective',
	async (id: string) => {
		await deleteStrategicObjective(id);
		return id;
	}
);

// Specific Objectives
export const fetchSpecificObjectives = createAsyncThunk(
	'programs/fetchSpecificObjectives',
	async () => {
		const objectives = await getSpecificObjectives();
		return objectives;
	}
);

export const addSpecificObjective = createAsyncThunk(
	'programs/addSpecificObjective',
	async (objective: {
		strategic_objective: string;
		specific_objective: string;
		actions_for_achievement: string;
		responsible_person: string;
		necessary_resources: string;
		indicator: string;
		goal: string;
		monitoring_frequency: string;
		deadline: string;
		observation?: string;
	}) => {
		const response = await createSpecificObjective(objective);
		return response;
	}
);

export const editSpecificObjective = createAsyncThunk(
	'programs/editSpecificObjective',
	async ({
		id,
		objective,
	}: {
		id: string;
		objective: Partial<{
			strategic_objective: string;
			specific_objective: string;
			actions_for_achievement: string;
			responsible_person: string;
			necessary_resources: string;
			indicator: string;
			goal: string;
			monitoring_frequency: string;
			deadline: string;
			observation?: string;
		}>;
	}) => {
		const response = await updateSpecificObjective(id, objective);
		return response;
	}
);

export const removeSpecificObjective = createAsyncThunk(
	'programs/removeSpecificObjective',
	async (id: string) => {
		await deleteSpecificObjective(id);
		return id;
	}
);

const programsSlice = createSlice({
	name: 'programs',
	initialState,
	reducers: {
		setSelectedObjective: (state, action) => {
			state.selectedObjective = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// Strategic Objectives
			.addCase(fetchStrategicObjectives.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchStrategicObjectives.fulfilled, (state, action) => {
				state.isLoading = false;
				state.strategicObjectives = action.payload;
			})
			.addCase(fetchStrategicObjectives.rejected, (state, action) => {
				state.isLoading = false;
				state.error =
					action.error.message || 'Failed to fetch strategic objectives';
			})
			.addCase(addStrategicObjective.fulfilled, (state, action) => {
				state.strategicObjectives.unshift(action.payload);
			})
			.addCase(editStrategicObjective.fulfilled, (state, action) => {
				const index = state.strategicObjectives.findIndex(
					(obj) => obj.id === action.payload.id
				);
				if (index !== -1) {
					state.strategicObjectives[index] = action.payload;
				}
			})
			.addCase(removeStrategicObjective.fulfilled, (state, action) => {
				state.strategicObjectives = state.strategicObjectives.filter(
					(obj) => obj.id !== action.payload
				);
			})
			// Specific Objectives
			.addCase(fetchSpecificObjectives.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchSpecificObjectives.fulfilled, (state, action) => {
				state.isLoading = false;
				state.specificObjectives = action.payload;
			})
			.addCase(fetchSpecificObjectives.rejected, (state, action) => {
				state.isLoading = false;
				state.error =
					action.error.message || 'Failed to fetch specific objectives';
			})
			.addCase(addSpecificObjective.fulfilled, (state, action) => {
				state.specificObjectives.unshift(action.payload);
			})
			.addCase(editSpecificObjective.fulfilled, (state, action) => {
				const index = state.specificObjectives.findIndex(
					(obj) => obj.id === action.payload.id
				);
				if (index !== -1) {
					state.specificObjectives[index] = action.payload;
				}
			})
			.addCase(removeSpecificObjective.fulfilled, (state, action) => {
				state.specificObjectives = state.specificObjectives.filter(
					(obj) => obj.id !== action.payload
				);
			});
	},
});

export const { setSelectedObjective } = programsSlice.actions;
export default programsSlice.reducer;
