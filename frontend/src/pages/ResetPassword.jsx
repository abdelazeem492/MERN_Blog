import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { getResetPasswordLink, resetPassword } from "../redux/api/password";
import NotFound from "./NotFound";

const ResetPassword = () => {
	const { userId, token } = useParams();
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const { isError } = useSelector((state) => state.password);

	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [type, setType] = useState("password");

	useEffect(() => {
		dispatch(getResetPasswordLink(userId, token));
	}, [dispatch, userId, token]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password.trim() === "") return toast.error("Password is required");
		setIsLoading(true);
		await dispatch(resetPassword(password, { userId, token }));
		setIsLoading(false);
		navigate("/login");
	};
	return (
		<section className={`container ${isError ? "my-auto" : "my-10"}`}>
			{isError ? (
				<NotFound />
			) : (
				<>
					<h1 className='heading'>Reset Password</h1>
					<form className='form mt-3' onSubmit={handleSubmit}>
						<div className='form-input'>
							<label htmlFor='password'>Password</label>
							<input
								autoFocus
								type={type}
								name='password'
								id='password'
								placeholder='Enter your password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>

							<div className='flex gap-2 mt-2'>
								<input
									type='checkbox'
									className='max-w-fit'
									id='show-password'
									onChange={() =>
										setType(type === "password" ? "text" : "password")
									}
								/>
								<label htmlFor='show-password'>Show password</label>
							</div>
						</div>
						<button
							disabled={isLoading}
							className='disabled:cursor-not-allowed disabled:opacity-60 '
						>
							{isLoading ? "Loading..." : "Submit"}
						</button>
					</form>
				</>
			)}
		</section>
	);
};

export default ResetPassword;
