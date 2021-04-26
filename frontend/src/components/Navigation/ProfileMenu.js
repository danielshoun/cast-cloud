import * as sessionActions from "../../store/session";
import {useDispatch} from "react-redux";

export default function ProfileMenu({ user }) {
    const dispatch = useDispatch();

    return (
        <div className='profileMenu'>
            <ul className='profileMenuList'>
                <li>Settings</li>
                <li>Subscriptions</li>
                <li>
                    <span className='logOutSpan' onClick={() => dispatch(sessionActions.logout())}>Log Out</span>
                </li>
            </ul>
        </div>
    )
}