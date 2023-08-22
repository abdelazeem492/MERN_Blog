import { Link, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "../redux/api/auth";
import { useEffect } from "react";

const VerifyEmail = () => {
	const { userId, token } = useParams();

	const dispatch = useDispatch();
	const { isEmailVerified } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(verifyEmail(userId, token));
	}, [dispatch, userId, token]);

	return (
		<section className='container my-auto text-center'>
			{isEmailVerified ? (
				<>
					<i className='bi bi-patch-check-fill sm:text-7xl text-6xl text-green-500 block' />
					<h1 className='sm:text-4xl text-3xl font-semibold text-dark-color my-8 capitalize'>
						Your Email verified successfully
					</h1>
					<Link
						className='sm:text-xl bg-darker-gradient text-white py-2 px-4 rounded-md block w-fit mx-auto'
						to={"/login"}
					>
						Go to Login
					</Link>
				</>
			) : (
				<NotFound />
			)}
		</section>
	);
};

export default VerifyEmail;
