import { passwordActions } from "../slices/passwordSlice";
import request from "../../utils/axiosRequest";
import { toast } from "react-hot-toast";

// Forgot password
export const forgotPassword = (email) => {
	return async () => {
		try {
			const { data } = await request.post("/password/reset-password", {
				email,
			});
			toast.success(data.message);
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};
};

// Get reset password
export const getResetPasswordLink = (userId, token) => {
	return async (dispatch) => {
		try {
			await request.get(`/password/reset-password/${userId}/${token}`);
		} catch (error) {
			console.log(error);
			dispatch(passwordActions.setError());
		}
	};
};

// Reset the password
export const resetPassword = (newPassword, user) => {
	return async () => {
		try {
			const { data } = await request.post(
				`/password/reset-password/${user.userId}/${user.token}`,
				{ password: newPassword },
			);
			toast.success(data.message);
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};
};
