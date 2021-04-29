import QueuePopup from "./QueuePopup";
import CommentPopup from "./CommentPopup";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import './AudioPopups.css';

export default function AudioPopups() {
    const audioState = useSelector(state => state.audio);
    const [showingQueue, setShowingQueue] = useState(false);
    const [showingComments, setShowingComments] = useState(false);

    function handlePopups(popup) {
        if(popup === 'queue') {
            if(showingQueue) {
                setShowingQueue(false);
            } else {
                setShowingComments(false);
                setShowingQueue(true);
            }
        } else {
            if(showingComments) {
                setShowingComments(false);
            } else {
                setShowingQueue(false);
                setShowingComments(true);
            }
        }
    }

    return (
        <>
            <div className='popupButtonsContainer'>
                <i className={`far fa-comment-alt commentButton${audioState.currentTrack !== null ? '' : ' inactiveButton'}`} onClick={() => handlePopups('comments')}/>
                <i className={`fas fa-list queueButton${audioState.currentTrack !== null ? '' : ' inactiveButton'}`} onClick={() => handlePopups('queue')}/>
            </div>
            {showingQueue && <QueuePopup/>}
            {showingComments && <CommentPopup/>}
        </>
    )
}