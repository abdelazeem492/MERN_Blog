import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { useSelector } from "react-redux";
import Dashboard from "./pages/dashboard/Dashboard";
import ToTop from "./components/ToTop";
import Profile from "./pages/Profile";
import Posts from "./pages/Posts";
import Category from "./pages/Category";
import Post from "./pages/Post";
import AboutUsPage from "./pages/About";
import Contact from "./pages/Contact";
import DashboardPosts from "./pages/dashboard/DashboardPosts";
import DashboardUsers from "./pages/dashboard/DashboardUsers";
import DashboardCategories from "./pages/dashboard/DashboardCategories";
import DashboardComments from "./pages/dashboard/DashboardComments";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
	const { user } = useSelector((state) => state.auth);
	return (
		<div className='App  mx-auto min-h-screen relative flex flex-col'>
			<Header />
			<Routes>
				<Route path='/' element={<Home />} />

				<Route path='/posts'>
					<Route index element={<Posts />} />
					<Route path=':id' element={<Post />} />
				</Route>

				<Route path='/categories/:category' element={<Category />} />
				<Route path='/about' element={<AboutUsPage />} />
				<Route path='/contact' element={<Contact />} />
				<Route
					path='/login'
					element={!user ? <Login /> : <Navigate to='/' />}
				/>
				<Route
					path='/register'
					element={!user ? <Register /> : <Navigate to='/' />}
				/>
				<Route path='/profile/:id' element={<Profile />} />

				<Route path='/dashboard'>
					<Route
						index
						element={
							user && user?.isAdmin ? <Dashboard /> : <Navigate to='/' />
						}
					/>
					<Route
						path='users'
						element={
							user && user?.isAdmin ? <DashboardUsers /> : <Navigate to='/' />
						}
					/>
					<Route
						path='posts'
						element={
							user && user?.isAdmin ? <DashboardPosts /> : <Navigate to='/' />
						}
					/>
					<Route
						path='categories'
						element={
							user && user?.isAdmin ? (
								<DashboardCategories />
							) : (
								<Navigate to='/' />
							)
						}
					/>
					<Route
						path='comments'
						element={
							user && user?.isAdmin ? (
								<DashboardComments />
							) : (
								<Navigate to='/' />
							)
						}
					/>
				</Route>

				<Route
					path='/users/:userId/verify/:token'
					element={!user ? <VerifyEmail /> : <Navigate to='/' />}
				/>
				<Route path='/forgot-password' element={<ForgotPassword />} />
				<Route
					path='/reset-password/:userId/:token'
					element={<ResetPassword />}
				/>

				<Route path='*' element={<NotFound />} />
			</Routes>
			<Footer />
			<ToTop />
		</div>
	);
}

export default App;
