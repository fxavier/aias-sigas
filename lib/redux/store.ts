import { configureStore } from '@reduxjs/toolkit';
import documentsReducer from './features/documentsSlice';
import authReducer from './features/authSlice';
import departmentsReducer from './features/departmentsSlice';
import programsReducer from './features/programsSlice';
import emergencyReducer from './features/emergencySlice';

export const store = configureStore({
	reducer: {
		documents: documentsReducer,
		auth: authReducer,
		departments: departmentsReducer,
		programs: programsReducer,
		emergency: emergencyReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
