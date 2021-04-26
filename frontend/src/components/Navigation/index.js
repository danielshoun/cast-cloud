import {Link, NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import ProfileButton from './ProfileButton';
import './Navigation.css';

export default function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <nav>
            <div className='logoContainer'>
                <Link className='logoLink' to='/'>CastCloud</Link>
            </div>
            <div className='searchContainer'>
                <i className="fas fa-search searchIcon"/>
                <input
                    className='navSearch'
                    type='text'
                    placeholder='Search for a podcast...'
                />
                <button className='searchButton'>Search</button>
            </div>
            <ul className='navList'>
                <li className='navItem'>
                    <NavLink className='navLink' to='/'>Home</NavLink>
                </li>

                {isLoaded && (sessionUser ?
                    <>
                        <li className='navItem'>
                            <NavLink className='navLink' to='/feed'>Feed</NavLink>
                        </li>
                        <li className='navItem'><ProfileButton user={sessionUser}/></li>
                    </>
                     :
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