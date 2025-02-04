import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signIn, signUp, signOut, getCurrentUser } from '@/lib/supabase/auth';
import type { User } from '@supabase/supabase-js';

interface AuthState {
	user: User | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	isLoading: true,
	error: null,
};

export const login = createAsyncThunk(
	'auth/login',
	async ({ email, password }: { email: string; password: string }) => {
		const { user } = await signIn(email, password);
		return user;
	}
);

export const register = createAsyncThunk(
	'auth/register',
	async ({ email, password }: { email: string; password: string }) => {
		const { user } = await signUp(email, password);
		return user;
	}
);

export const logout = createAsyncThunk('auth/logout', async () => {
	await signOut();
});

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
	const user = await getCurrentUser();
	return user;
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload;
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to login';
			})
			.addCase(register.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload;
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to register';
			})
			.addCase(logout.fulfilled, (state) => {
				state.user = null;
			})
			.addCase(fetchUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload;
			})
			.addCase(fetchUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to fetch user';
			});
	},
});

export default authSlice.reducer;
