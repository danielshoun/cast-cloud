import QueuePopup from "./QueuePopup";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import './AudioPopups.css';

export default function AudioPopups() {
    const audioState = useSelector(state => state.audio);
    const [showingQueue, setShowingQueue] = useState(false);

    return (
        <>
            <div className='popupButtonsContainer'>
                <i className={`far fa-comment-alt commentButton${audioState.currentTrack !== null ? '' : ' inactiveButton'}`}/>
                <i className={`fas fa-list queueButton${audioState.currentTrack !== null ? '' : ' inactiveButton'}`} onClick={() => setShowingQueue(prevState => !prevState)}/>
            </div>
            {showingQueue && <QueuePopup/>}
        </>
    )
}