import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface PharmacyState {
  pharmacies: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PharmacyState = {
  pharmacies: [],
  loading: false,
  error: null,
};

// 🔥 비동기 thunk 액션
export const fetchPharmacies = createAsyncThunk(
  'pharmacy/fetchPharmacies',
  async (keyword: string = '김해') => {
    const res = await axios.get(`http://52.78.204.121:8080/pharmacy/search?keyword=${keyword}`);
    return res.data;
  }
);

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPharmacies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPharmacies.fulfilled, (state, action) => {
        state.loading = false;
        state.pharmacies = action.payload;
      })
      .addCase(fetchPharmacies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load pharmacies';
      });
  },
});

export default pharmacySlice.reducer;
