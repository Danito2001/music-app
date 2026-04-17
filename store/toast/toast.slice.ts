// toast.slice.ts
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export interface Toast {
	id: string;
	title: string | null;
	description?: string;
}

interface ToastState {
  	toasts: Toast[];
}

const initialState: ToastState = {
  	toasts: [],
};

const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
		showToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
			state.toasts.push({
				id: nanoid(),
				...action.payload,
			});
		},
		removeToast: (state, action: PayloadAction<string>) => {
			state.toasts = state.toasts.filter(t => t.id !== action.payload);
		},
    },
});

export const { showToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;