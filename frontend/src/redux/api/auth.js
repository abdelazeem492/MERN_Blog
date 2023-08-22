import request from "../../utils/axiosRequest";
import { authActions } from "../slices/authSlice";
import toast from "react-hot-toast";

//* Login
export const login = (user) => {
	return async (dispatch) => {
		try {
			const { data } = await request.post("/auth/login", user);
			dispatch(authActions.login(data));
			toast.success("Login Successfully");
			localStorage.setItem("userInfo", JSON.stringify(data));
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};
};

//* Logout
export const logout = () => {
	return async (dispatch) => {
		dispatch(authActions.logout());
		localStorage.removeItem("userInfo");
		toast.success("Logout Successfully");
	};
};

//* Verify Email
export const verifyEmail = (userId, token) => {
	return async (dispatch) => {
		try {
			await request.get(`/auth/${userId}/verify/${token}`);
			dispatch(authActions.setIsEmailVerified());
			toast.success("Your email verified successfully");
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};
};
