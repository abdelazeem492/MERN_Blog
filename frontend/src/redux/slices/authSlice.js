import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: localStorage.getItem("userInfo")
			? JSON.parse(localStorage.getItem("userInfo"))
			: null,
		isEmailVerified: false,
	},
	reducers: {
		login: (state, action) => {
			state.user = action.payload;
		},
		setProfilePic: (state, action) => {
			state.user.profilePic = action.payload;
		},
		logout: (state) => {
			state.user = null;
		},
		setIsEmailVerified: (state, action) => {
			state.isEmailVerified = true;
		},
	},
});

const authReducer = authSlice.reducer;
const authActions = authSlice.actions;

export { authReducer, authActions };
