import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../redux/api/profile";

const EditProfile = ({ setEditPopup, profile, forceUpdate }) => {
	const [bio, setBio] = useState(profile.bio);
	const [firstName, setFirstName] = useState(profile.firstName);
	const [lastName, setLastName] = useState(profile.lastName);

	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await dispatch(updateProfile({ bio, firstName, lastName }, profile._id));
		forceUpdate();
		setEditPopup(false);
	};

	return (
		<form
			method='post'
			onSubmit={handleSubmit}
			className='flex flex-col gap-4 justify-center items-center sm:px-0 px-4 min-w-[370px] border-none'
		>
			<h1>Edit Your Profile</h1>
			<div className='form-input gap-0'>
				<label htmlFor='firstName' style={{ color: "white" }}>
					First Name
				</label>
				<input
					type='text'
					name='firstName'
					id='firstName'
					className='text-dark-color'
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
				/>
			</div>
			<div className='form-input gap-0'>
				<label htmlFor='lastName' style={{ color: "white" }}>
					Last Name
				</label>
				<input
					type='text'
					name='lastName'
					id='lastName'
					className='text-dark-color'
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
				/>
			</div>
			<div className='form-input gap-0'>
				<label htmlFor='bio' style={{ color: "white" }}>
					Bio
				</label>
				<textarea
					name='bio'
					id='bio'
					rows={5}
					className='rounded-lg text-dark-color p-3'
					value={bio}
					onChange={(e) => setBio(e.target.value)}
				/>
			</div>
			<div className='btns'>
				<button
					type='button'
					className='cancel'
					onClick={() => setEditPopup(false)}
				>
					Cancel
				</button>
				<button type='submit'>Save</button>
			</div>
		</form>
	);
};

export default EditProfile;
