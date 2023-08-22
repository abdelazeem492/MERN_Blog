import { categoryActions } from "../slices/categorySlice";
import request from "../../utils/axiosRequest";
import { toast } from "react-hot-toast";

// Fetch all categories
export const fetchCategories = () => async (dispatch) => {
	try {
		const { data } = await request.get("/categories");
		dispatch(categoryActions.setCategories(data));
	} catch (error) {
		toast.error(error.response.data.message);
	}
};

// Create new category
export const createCategory = (newCategory) => async (dispatch, getState) => {
	try {
		const { data } = await request.post("/categories", newCategory, {
			headers: {
				Authorization: `Bearer ${getState().auth.user.token}`,
			},
		});
		dispatch(
			categoryActions.setCategories([data, ...getState().category.categories]),
		);
		toast.success("Category created successfully");
	} catch (error) {
		toast.error(error.response.data.message);
	}
};

// Delete category
export const deleteCategory = (id) => async (dispatch, getState) => {
	try {
		const { data } = await request.delete(`/categories/${id}`, {
			headers: {
				Authorization: `Bearer ${getState().auth.user.token}`,
			},
		});
		dispatch(
			categoryActions.setCategories(
				getState().category.categories.filter((c) => c._id !== id),
			),
		);
		toast.success(data.message);
	} catch (error) {
		toast.error(error.response.data.message);
	}
};
