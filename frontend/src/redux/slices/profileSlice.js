import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
	name: "profile",
	initialState: {
		profile: null,
		usersCount: null,
		profiles: [],
	},
	reducers: {
		setProfile(state, action) {
			state.profile = action.payload;
		},
		updateProfile(state, action) {
			state.profile = action.payload;
		},
		setProfilePic(state, action) {
			state.profile.profilePic = action.payload;
		},
		setUsersCount(state, action) {
			state.usersCount = action.payload;
		},
		setProfiles(state, action) {
			state.profiles = action.payload;
		},
	},
});

const profileReducer = profileSlice.reducer;
const profileActions = profileSlice.actions;

export { profileReducer, profileActions };
