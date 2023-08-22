import { profileActions } from "../slices/profileSlice";
import request from "../../utils/axiosRequest";
import toast from "react-hot-toast";
import { authActions } from "../slices/authSlice";

//* Get Profile
export const getProfile = (userId) => async (dispatch) => {
	try {
		const { data } = await request.get(`/users/${userId}`);
		dispatch(profileActions.setProfile(data));
	} catch (error) {
		toast.error(error.response.data.message);
	}
};

//* Upload ProfilePic
export const uploadProfilePic = (newProfilePic) => async (dispatch) => {
	try {
		const { data } = await request.post(
			`/users/upload-profile-picture`,
			newProfilePic,
			{
				headers: {
					Authorization: `Bearer ${
						JSON.parse(localStorage.getItem("userInfo")).token
					}`,
					"Content-Type": "multipart/form-data",
				},
			},
		);
		dispatch(profileActions.setProfilePic(data.profilePic));
		dispatch(authActions.setProfilePic(data.profilePic));

		const user = JSON.parse(localStorage.getItem("userInfo"));
		user.profilePic = data?.profilePic;
		localStorage.setItem("userInfo", JSON.stringify(user));
		toast.success("Profile Picture Updated Successfully");
	} catch (error) {
		toast.error(error.response.data.message);
	}
};

//* update profile
export const updateProfile =
	(profile, userId) => async (dispatch, getState) => {
		try {
			const { data } = await request.put(`/users/${userId}`, profile, {
				headers: {
					Authorization: `Bearer ${getState().auth.user.token}`,
				},
			});
			dispatch(profileActions.updateProfile(data));
			const user = JSON.parse(localStorage.getItem("userInfo"));
			user.firstName = data.firstName;
			user.lastName = data.lastName;
			localStorage.setItem("userInfo", JSON.stringify(user));
			toast.success("Profile Updated Successfully");
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};

//* Delete profile
export const deleteProfile = (userId) => async (dispatch, getState) => {
	try {
		const { data } = await request.delete(`/users/${userId}`, {
			headers: {
				Authorization: `Bearer ${getState().auth.user.token}`,
			},
		});
		localStorage.removeItem("userInfo");
		getState().auth.user = null;
		dispatch(profileActions.setProfile(null));
		toast.success(data?.message);
	} catch (error) {
		toast.error(error.response?.data?.message);
		console.log(error);
	}
};

//* Delete user (Admin)
export const deleteProfileAdmin = (userId) => async (dispatch, getState) => {
	try {
		const { data } = await request.delete(`/users/${userId}`, {
			headers: {
				Authorization: `Bearer ${getState().auth.user.token}`,
			},
		});
		toast.success(data?.message);
	} catch (error) {
		toast.error(error.response.data.message);
	}
};

//* Get users count
export const getUsersCount = () => async (dispatch, getState) => {
	try {
		const { data } = await request.get(`/users/count`, {
			headers: {
				Authorization: `Bearer ${getState().auth.user.token}`,
			},
		});
		dispatch(profileActions.setUsersCount(data));
	} catch (error) {
		toast.error(error.response.data.message);
	}
};

//* Get all users profiles
export const getAllUsersProfiles = () => async (dispatch, getState) => {
	try {
		const { data } = await request.get(`/users`, {
			headers: {
				Authorization: `Bearer ${getState().auth.user.token}`,
			},
		});
		dispatch(profileActions.setProfiles(data));
	} catch (error) {
		toast.error(error.response.data.message);
	}
};
