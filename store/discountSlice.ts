// store/navigateUrlSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface Discount {
  afterDiscountPrice: number |null;
}

const initialState: Discount = {
  afterDiscountPrice: null,
};

export const discountSlice = createSlice({
  name: 'discount',
  initialState,
  reducers: {
    calculateDiscount: (state, action: PayloadAction<any>) => {
    //   state.afterDiscountPrice = action.payload;
    console.log(action)
    },
  },
});
export const { calculateDiscount } = discountSlice.actions;
export default discountSlice.reducer;
