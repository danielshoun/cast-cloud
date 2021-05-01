import { Route, Switch } from 'react-router-dom';
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import LoginFormPage from './components/LoginFormPage';
import * as sessionActions from './store/session';
import SignupFormPage from "./components/SignupFormPage";
import Navigation from "./components/Navigation";
import SearchResults from "./components/SearchResults";
import PodcastDetails from "./components/PodcastDetails";
import Footer from "./components/Footer";
import Feed from "./components/Feed";
import Home from "./components/Home";

function App() {
	const [isLoaded, setIsLoaded] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(sessionActions.restoreUser())
			.then(() => setIsLoaded(true));
	}, [dispatch])

	return isLoaded && (
		<>
			<Navigation isLoaded={isLoaded}/>
			<Switch>
				<Route exact path='/'>
					<Home/>
				</Route>
				<Route path='/podcasts/:itunesId'>
					<PodcastDetails/>
				</Route>
				<Route path='/search'>
					<SearchResults/>
				</Route>
				<Route path='/feed'>
					<Feed/>
				</Route>
				<Route path='/login'>
					<LoginFormPage/>
				</Route>
				<Route path='/signup'>
					<SignupFormPage/>
				</Route>
			</Switch>
			<Footer/>
		</>
	);
}

export default App;
