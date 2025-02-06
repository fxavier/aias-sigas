import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
	getDepartments,
	createDepartment,
	updateDepartment,
	deleteDepartment,
} from '@/lib/supabase/services/departmentsService';
import type { Department } from '@/lib/supabase/types';

interface DepartmentsState {
	departments: Department[];
	isLoading: boolean;
	error: string | null;
	selectedDepartment: Department | null;
}

const initialState: DepartmentsState = {
	departments: [],
	isLoading: false,
	error: null,
	selectedDepartment: null,
};

export const fetchDepartments = createAsyncThunk(
	'departments/fetchDepartments',
	async () => {
		const departments = await getDepartments();
		return departments;
	}
);

export const addDepartment = createAsyncThunk(
	'departments/addDepartment',
	async (department: { name: string; description: string }) => {
		const response = await createDepartment(department);
		return response;
	}
);

export const editDepartment = createAsyncThunk(
	'departments/editDepartment',
	async ({
		id,
		department,
	}: {
		id: string;
		department: Partial<Department>;
	}) => {
		const response = await updateDepartment(id, department);
		return response;
	}
);

export const removeDepartment = createAsyncThunk(
	'departments/removeDepartment',
	async (id: string) => {
		await deleteDepartment(id);
		return id;
	}
);

const departmentsSlice = createSlice({
	name: 'departments',
	initialState,
	reducers: {
		setSelectedDepartment: (state, action) => {
			state.selectedDepartment = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchDepartments.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchDepartments.fulfilled, (state, action) => {
				state.isLoading = false;
				state.departments = action.payload;
			})
			.addCase(fetchDepartments.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to fetch departments';
			})
			.addCase(addDepartment.fulfilled, (state, action) => {
				state.departments.unshift(action.payload);
			})
			.addCase(editDepartment.fulfilled, (state, action) => {
				const index = state.departments.findIndex(
					(dept) => dept.id === action.payload.id
				);
				if (index !== -1) {
					state.departments[index] = action.payload;
				}
			})
			.addCase(removeDepartment.fulfilled, (state, action) => {
				state.departments = state.departments.filter(
					(dept) => dept.id !== action.payload
				);
			});
	},
});

export const { setSelectedDepartment } = departmentsSlice.actions;
export default departmentsSlice.reducer;
