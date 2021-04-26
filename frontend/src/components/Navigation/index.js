import {Link, NavLink, useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import ProfileButton from './ProfileButton';
import './Navigation.css';
import {useState} from "react";

export default function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const [searchTerm, setSearchTerm] = useState('');
    const history = useHistory();

    async function handleSearch() {
        history.push(`/search?term=${searchTerm}`);
    }

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
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                />
                <button className='searchButton' onClick={handleSearch}>Search</button>
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