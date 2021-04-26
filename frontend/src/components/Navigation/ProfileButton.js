import {useDispatch} from "react-redux";
import * as sessionActions from '../../store/session'
import {useEffect, useState} from "react";

export default function ProfileButton({ user }) {
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(visible) {
            function closeMenu() {
                setVisible(false);
            }
            document.addEventListener('click', closeMenu);
            return () => document.removeEventListener('click', closeMenu);
        }
    }, [visible]);

    function openMenu() {
        if(!visible) setVisible(true)
    }

    return (
        <>
            <button onClick={openMenu}>
                <i className='fas fa-user-circle'/>
            </button>
            {visible &&
                <ul>
                    <li>{user.username}</li>
                    <li>{user.email}</li>
                    <li>
                        <button onClick={() => dispatch(sessionActions.logout())}>Log Out</button>
                    </li>
                </ul>}
        </>
    )
}