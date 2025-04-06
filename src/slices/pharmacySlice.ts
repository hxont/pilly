import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
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

// ✅ 기본 검색 API (예: '김해' 키워드 검색)
export const fetchPharmacies = createAsyncThunk(
  'pharmacy/fetchPharmacies',
  async (keyword: string = '김해') => {
    const res = await axios.get(
      `http://52.78.204.121:8080/pharmacy/search?keyword=${keyword}`,
    );
    return res.data;
  },
);

// ✅ 영업중 약국
export const fetchNowOpenPharmacies = createAsyncThunk(
  'pharmacy/fetchNowOpen',
  async () => {
    const res = await axios.get('http://52.78.204.121:8080/pharmacy/now');
    return res.data;
  },
);

// ✅ 연중무휴 약국
export const fetchAlwaysOpenPharmacies = createAsyncThunk(
  'pharmacy/fetchAlwaysOpen',
  async () => {
    const res = await axios.get(
      'http://52.78.204.121:8080/pharmacy/alwaysopen',
    );
    return res.data;
  },
);

// ✅ 심야약국
export const fetchNightPharmacies = createAsyncThunk(
  'pharmacy/fetchNight',
  async () => {
    const res = await axios.get('http://52.78.204.121:8080/pharmacy/night');
    return res.data;
  },
);

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // 📌 공통: 요청 시작
      .addMatcher(
        action =>
          action.type.startsWith('pharmacy/') &&
          action.type.endsWith('/pending'),
        state => {
          state.loading = true;
          state.error = null;
        },
      )
      // 📌 공통: 요청 실패
      .addMatcher(
        action =>
          action.type.startsWith('pharmacy/') &&
          action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || '약국 정보를 불러오지 못했어요';
        },
      )
      // 📌 공통: 요청 성공 시 데이터 업데이트
      .addMatcher(
        action =>
          action.type.startsWith('pharmacy/') &&
          action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.loading = false;
          state.pharmacies = action.payload;
        },
      );
  },
});

export default pharmacySlice.reducer;