import { useEffect, useReducer, useRef, useState } from "react";
import Moment from "react-moment";
import DashboardSideBar from "./DashboardSideBar";
import { useDispatch, useSelector } from "react-redux";
import { getAllComments, deleteComment } from "../../redux/api/comment";
import { Link } from "react-router-dom";
import PopUp from "../../components/PopUp";
import useClickOutside from "../../hooks/useClickOutside";

const DashboardComments = () => {
	const { comments: allComments } = useSelector((state) => state.comment);

	const [deletePopup, setDeletePopup] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [sort, setSort] = useState("");
	const [dropdown, setDropdown] = useState(false);
	const [comments, setComments] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	const dispatch = useDispatch();

	// z: is a variable that will be used to force a re-render
	const [z, forceUpdate] = useReducer((x) => x + 1, 0);

	const ref = useRef(null);
	useClickOutside(ref, () => setDropdown(false));

	useEffect(() => {
		dispatch(getAllComments());
	}, [dispatch, z]);

	useEffect(() => {
		switch (sort) {
			case "latest":
				setComments(
					[...allComments]?.sort(
						(a, b) =>
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
					),
				);
				break;

			case "oldest":
				setComments(
					[...allComments]?.sort(
						(a, b) =>
							new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
					),
				);
				break;

			default:
				setComments([...allComments]);
				break;
		}
		searchTerm.trim() !== "" &&
			setComments(
				[...allComments]?.filter(
					(comment) =>
						comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
						comment.userInfo.firstName
							.toLowerCase()
							.includes(searchTerm.toLowerCase()) ||
						comment.userInfo.lastName
							.toLowerCase()
							.includes(searchTerm.toLowerCase()),
				),
			);
	}, [allComments, sort, searchTerm]);

	const handleDeleteComment = async (id) => {
		setIsLoading(true);
		await dispatch(deleteComment(id));
		setIsLoading(false);
		setDeletePopup(false);
		forceUpdate();
	};

	return (
		<section>
			<section className='flex '>
				<DashboardSideBar />
				<main className='p-5 pt-10 pe-10 flex-1 overflow-auto'>
					<h1 className='md:text-3xl text-2xl pb-2 border-b-2 border-dark-color w-fit font-semibold'>
						All Comments <i className='bi bi-chat-left-dots' /> (
						{allComments.length})
					</h1>
					<div className='my-6 flex sm:flex-row flex-col sm:gap-8 gap-4 items-center'>
						<div className='form-input'>
							<input
								type='text'
								placeholder='Search by title or creator'
								onChange={(e) => setSearchTerm(e.target.value)}
								value={searchTerm}
							/>
						</div>
						<button
							onClick={() => setDropdown(!dropdown)}
							className='hover:bg-white px-4 tex-lg font-semibold py-2 rounded w-52 text-blue-600 relative'
						>
							Sort <i className='bi bi-chevron-down' />
							{/* Dropdown */}
							{dropdown && (
								<div
									ref={ref}
									className='dropdown w-40 font-normal border-t absolute z-20 bg-gray-50 flex flex-col justify-center text-dark-color items-center top-12 left-0 rounded-lg shadow-lg overflow-hidden'
								>
									<button
										onClick={() => {
											setSort("latest");
											setDropdown(false);
										}}
										className='border-b border-border-color w-40 py-2 text-center pb-2 hover:bg-container-color'
									>
										By latest
									</button>
									<button
										onClick={() => {
											setSort("oldest");
											setDropdown(false);
										}}
										className='border-b border-border-color w-40 py-2 text-center pb-2 hover:bg-container-color'
									>
										By oldest
									</button>
								</div>
							)}
						</button>
					</div>
					<div className='relative overflow-auto shadow-md sm:rounded-lg mt-4'>
						<table className='w-full text-md text-left text-gray-500'>
							<thead className='text-gray-700 uppercase bg-container-color  '>
								<tr>
									<th scope='col' className='ps-6 py-3 text-lg'>
										#
									</th>
									<th scope='col' className='px-3 py-3'>
										User
									</th>
									<th scope='col' className='px-3 py-3'>
										Comment
									</th>
									<th scope='col' className='px-3 py-3'>
										time
									</th>
									<th scope='col' className='px-3 py-3'>
										post
									</th>
									<th scope='col' colSpan={2} className='ps-3 py-3'>
										action
									</th>
								</tr>
							</thead>
							<tbody>
								{comments?.map((comment, index) => (
									<tr
										className='hover:bg-gray-100 bg-gray-50'
										key={comment?._id}
									>
										<td className='ps-6 py-4'>{index + 1}</td>
										<td className='ps-3 pe-10 py-4 text-gray-900 whitespace-nowrap flex items-center gap-2 text-sm font-semibold'>
											<img
												src={comment?.userInfo?.profilePic?.url}
												alt='user'
												className='w-10 h-10 rounded-full'
											/>{" "}
											<span>
												{comment?.userInfo?.firstName}{" "}
												{comment?.userInfo?.lastName}
											</span>
										</td>
										<td className='px-3 py-4 min-w-[200px] capitalize'>
											{comment?.text.length > 35
												? comment?.text.slice(0, 35) + "..."
												: comment?.text}
										</td>
										<td className='px-3 py-4 min-w-[130px]'>
											<span className='text-blue-500 font-semibold text-sm'>
												<Moment fromNow ago>
													{comment.createdAt}
												</Moment>{" "}
												ago
											</span>
										</td>
										<td className='px-3 py-4 min-w-[120px] '>
											<Link
												to={`/posts/${comment?.postId}`}
												className='bg-violet-500 text-white block text-sm py-1 px-2 rounded w-fit text-center'
											>
												View Post <i className='bi bi-eye' />
											</Link>
										</td>
										<td className='px-3 py-4 min-w-[100px]'>
											<button
												onClick={() => setDeletePopup(true)}
												title='Delete User'
												className='bg-red-500 w-fit rounded px-2 py-1 text-sm text-white'
											>
												Delete <i className='bi bi-trash' />
											</button>
										</td>
										{/* Delete comment popup */}
										<PopUp popup={deletePopup}>
											<i className='bi bi-exclamation-triangle' />
											<h1>Are you sure you want to delete this user</h1>
											<div className='btns'>
												<button
													className='cancel'
													onClick={() => setDeletePopup(false)}
												>
													Cancel
												</button>
												<button
													disabled={isLoading}
													onClick={() => handleDeleteComment(comment?._id)}
												>
													{isLoading ? "Deleting..." : "Delete"}
												</button>
											</div>
										</PopUp>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</main>
			</section>
		</section>
	);
};

export default DashboardComments;
