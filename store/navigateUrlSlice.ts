// store/navigateUrlSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface NavigateUrl {
  path: string |null;
}

const initialState: NavigateUrl = {
  path: null,
};

export const navigateUrlSlice = createSlice({
  name: 'navigateUrl',
  initialState,
  reducers: {
    addPath: (state, action: PayloadAction<string>) => {
      state.path = action.payload;
    },
  },
});

// Export action
export const { addPath } = navigateUrlSlice.actions;


export default navigateUrlSlice.reducer;
