import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../redux/api/password";

const ForgotPassword = () => {
	const dispatch = useDispatch();

	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (email.trim() === "") return toast.error("Email is required");
		setIsLoading(true);
		await dispatch(forgotPassword(email));
		setIsLoading(false);
	};

	return (
		<section className='container my-10'>
			<h1 className='heading'>Forgot Password</h1>
			<form className='form mt-3' onSubmit={handleSubmit}>
				<div className='form-input'>
					<label htmlFor='email'>Email</label>
					<input
						autoFocus
						type='email'
						name='email'
						id='email'
						placeholder='Enter your email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<button
					disabled={isLoading || email.trim() === ""}
					className='disabled:cursor-not-allowed disabled:opacity-60 '
				>
					{isLoading ? (
						<span>Sending...</span>
					) : (
						<span>
							Send <i className='bi bi-send' />
						</span>
					)}
				</button>
			</form>
		</section>
	);
};

export default ForgotPassword;
