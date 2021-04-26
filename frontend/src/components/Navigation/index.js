import { NavLink } from "react-router-dom";
import {useSelector} from "react-redux";
import ProfileButton from './ProfileButton';
import './Navigation.css';

export default function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <nav>
            <ul>
                <li>
                    <NavLink to='/'>Home</NavLink>
                </li>
                {isLoaded && (sessionUser ? <li><ProfileButton user={sessionUser}/></li> :
                    <>
                        <li>
                            <NavLink to='/login'>Log In</NavLink>
                        </li>
                        <li>
                            <NavLink to='/signup'>Sign Up</NavLink>
                        </li>
                    </>)}
            </ul>
        </nav>
    )
}