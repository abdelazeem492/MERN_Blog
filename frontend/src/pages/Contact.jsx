import { useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

const Contact = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [subject, setSubject] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [disabled, setDisabled] = useState(
		(!name && !email && !message && !subject) || isLoading ? true : false,
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		await emailjs.send(
			"service_qqbpq9e",
			"template_vce9w7b",
			{
				name,
				email,
				message,
				subject,
			},
			"nVQGS0t6GCzRue6xu",
		);
		setIsLoading(false);
		toast.success("Message sent successfully");
		setEmail("");
		setName("");
		setSubject("");
		setMessage("");
		setDisabled(true);
	};

	return (
		<section className='container'>
			<h1 className='heading'>Contact Us</h1>
			<div className='flex justify-between items-center gap-16'>
				<form
					className='flex flex-col gap-4 min-w-full md:min-w-[50%]'
					onSubmit={handleSubmit}
				>
					<div className='form-input'>
						<label htmlFor='name'>Name</label>
						<input
							type='text'
							autoFocus
							id='name'
							placeholder='Enter your name'
							className='p-3 rounded-md'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className='form-input'>
						<label htmlFor='email'>Email</label>
						<input
							type='email'
							placeholder='Enter your email'
							id='email'
							className='p-3 rounded-md'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className='form-input'>
						<label htmlFor='subject'>Subject</label>
						<input
							type='text'
							placeholder='Enter subject'
							id='subject'
							className='p-3 rounded-md'
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
						/>
					</div>
					<div className='form-input'>
						<label htmlFor='message'>Message</label>
						<textarea
							placeholder='Enter your message'
							id='message'
							className='p-3 rounded-md'
							value={message}
							rows='5'
							onChange={(e) => setMessage(e.target.value)}
						/>
					</div>
					<button
						disabled={disabled}
						className='p-2 rounded-md bg-darker-gradient text-body-color w-32 md:text-lg opacity-90 hover:opacity-100 duration-200 ease-in-out active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed'
					>
						{isLoading ? (
							"Sending..."
						) : (
							<span>
								Send <i className='bi bi-send' />
							</span>
						)}
					</button>
				</form>
				<img
					src='/images/contact.png'
					alt='contact'
					className='md:max-w-[50%] max-w-0'
				/>
			</div>
		</section>
	);
};

export default Contact;
