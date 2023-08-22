import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/api/auth";
import { Link } from "react-router-dom";

const Login = () => {
	const [type, setType] = useState("password");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();

	const handleLogin = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		await dispatch(login({ email, password }));
		setIsLoading(false);
		window.scrollTo(0, 0);
	};

	return (
		<section className='container'>
			<h1 className='heading'>Login</h1>
			<form className='form mb-3' method='post' onSubmit={handleLogin}>
				<div className='form-input'>
					<label htmlFor='email'>Email</label>
					<input
						type='email'
						name='email'
						id='email'
						placeholder='Enter your email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className='form-input'>
					<label htmlFor='password'>Password</label>
					<input
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
					className='disabled:cursor-not-allowed disabled:opacity-60'
				>
					{isLoading ? (
						<span>Loading...</span>
					) : (
						<span>
							Login <i className='bi bi-box-arrow-in-right' />
						</span>
					)}
				</button>
				<p>
					Don't have account?{" "}
					<Link to='/register' className='underline text-blue-700'>
						Register
					</Link>
				</p>
			</form>
			<p className=' text-center'>
				Are you forgot your password?{" "}
				<Link to='/forgot-password' className='underline text-blue-700'>
					forget password
				</Link>
			</p>
		</section>
	);
};

export default Login;
