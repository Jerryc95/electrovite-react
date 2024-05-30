// the settings slice includes all cross app settings and more that
// is local only and not required of any API or user signed in

import {PayloadAction,  createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';

interface settingsState {
  isOnboarded: boolean;
}

const initialSettingsState: settingsState = {
  isOnboarded: false,
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialSettingsState,
    reducers: {
        completeOnboarding: (state) => {
            state.isOnboarded = true;
          },
    }
})

export const getSettings = (state: RootState) => state.settingsReducer

export const {completeOnboarding} = settingsSlice.actions
export default settingsSlice.reducer