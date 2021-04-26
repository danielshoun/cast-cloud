import { NavLink } from "react-router-dom";
import {useSelector} from "react-redux";
import ProfileButton from './ProfileButton';
import './Navigation.css';

export default function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <nav>
            <div className='logoContainer'>
                CastCloud
            </div>
            <div className='searchContainer'>
                <i className="fas fa-search searchIcon"/>
                <input className='navSearch' type='text'/>
                <button className='searchButton'>Search</button>
            </div>
            <ul className='navList'>
                <li className='navItem'>
                    <NavLink className='navLink' to='/'>Home</NavLink>
                </li>
                <li className='navItem'>
                    <NavLink className='navLink' to='/feed'>Feed</NavLink>
                </li>
                {isLoaded && (sessionUser ? <li className='navItem'><ProfileButton user={sessionUser}/></li> :
                    <>
                        <li className='navItem'>
                            <NavLink className='navLink' to='/login'>Log In</NavLink>
                        </li>
                        <li className='navItem'>
                            <NavLink className='navLink' to='/signup'>Sign Up</NavLink>
                        </li>
                    </>)}
            </ul>
        </nav>
    )
}