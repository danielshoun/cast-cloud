import { Route, Switch } from 'react-router-dom';
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import LoginFormPage from './components/LoginFormPage';
import * as sessionActions from './store/session';
import SignupFormPage from "./components/SignupFormPage";
import Navigation from "./components/Navigation";
import SearchResults from "./components/SearchResults";

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
				<Route path='/search'>
					<SearchResults/>
				</Route>
				<Route path='/login'>
					<LoginFormPage/>
				</Route>
				<Route path='/signup'>
					<SignupFormPage/>
				</Route>
			</Switch>
		</>
	);
}

export default App;
