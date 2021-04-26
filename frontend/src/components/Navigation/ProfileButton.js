import {useEffect, useState} from "react";
import ProfileMenu from "./ProfileMenu";

export default function ProfileButton({ user }) {
    const [visible, setVisible] = useState(false);

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
            <i onClick={openMenu} className='fas fa-user-circle profileButton'/>
            {visible && <ProfileMenu user={user}/>}
        </>
    )
}