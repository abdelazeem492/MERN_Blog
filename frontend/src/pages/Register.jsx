import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import request from "../utils/axiosRequest";
import toast from "react-hot-toast";

const Register = () => {
	const [type, setType] = useState("password");

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			const { data } = await request.post("/auth/register", {
				firstName,
				lastName,
				email,
				password,
			});
			setIsLoading(false);
			toast.success(data.message);
			navigate("/login");
		} catch (error) {
			setIsLoading(false);
			toast.error(error.response.data.message);
		}
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	});

	return (
		<section className='container '>
			<h1 className='heading'>Register</h1>
			<form className='form mb-16' method='post' onSubmit={handleRegister}>
				<div className='form-input'>
					<label htmlFor='firstName'>First name</label>
					<input
						type='text'
						name='firstName'
						id='firstName'
						placeholder='Enter your first name'
						required
						onChange={(e) => setFirstName(e.target.value)}
						value={firstName}
					/>
				</div>
				<div className='form-input'>
					<label htmlFor='lastName'>Last name</label>
					<input
						type='text'
						name='lastName'
						id='lastName'
						placeholder='Enter your last name'
						required
						onChange={(e) => setLastName(e.target.value)}
						value={lastName}
					/>
				</div>
				<div className='form-input'>
					<label htmlFor='email'>Email</label>
					<input
						type='email'
						name='email'
						id='email'
						placeholder='Enter your email'
						required
						onChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
				</div>
				<div className='form-input'>
					<label htmlFor='password'>Password</label>
					<input
						type={type}
						name='password'
						id='password'
						placeholder='Enter your password'
						required
						onChange={(e) => setPassword(e.target.value)}
						value={password}
					/>
					<div className='flex gap-2 mt-2'>
						<input
							type='checkbox'
							className='max-w-fit'
							id='show-password'
							onChange={(e) => {
								setType(type === "password" ? "text" : "password");
							}}
						/>
						<label htmlFor='show-password'>Show password</label>
					</div>
				</div>
				<button
					disabled={isLoading}
					className='disabled:opacity-50 disabled:cursor-not-allowed'
				>
					{isLoading ? (
						<span>Registering...</span>
					) : (
						<span>
							Register <i className='bi bi-person-plus' />
						</span>
					)}
				</button>
				<p>
					Already have an account?{" "}
					<Link to='/login' className='underline text-blue-700'>
						Login
					</Link>
				</p>
			</form>
		</section>
	);
};

export default Register;
