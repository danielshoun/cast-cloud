import './CommentPopup.css';
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";

export default function CommentPopup() {
    const userState = useSelector(state => state.session);
    const audioState = useSelector(state => state.audio);
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/episodes/${audioState.queue[audioState.currentTrack].id}/comments`);
            const data = await res.json();
            setComments(data);
        }
        if(audioState.currentTrack !== null) {
            fetchData().then();
        }
    }, [audioState.queue[audioState.currentTrack]])

    async function sendComment() {
        const comment = {
            userId: userState.user.id,
            episodeId: audioState.queue[audioState.currentTrack].id,
            text: newCommentText,
            timestamp: audioState.timestamp
        }
        console.log(comment);
    }

    return (
        <div className='commentPopupContainer'>
            <div className='commentHeader'>Comments</div>
            <div className='commentContent'>
                {comments.length === 0 ?
                    <div className='emptyCommentContent'>
                        {audioState.currentTrack !== null ? 'No comments for this episode yet.' : 'You must select an episode first.'}
                    </div> :
                    <div>
                    </div>
                }
            </div>
            <div className='newCommentContainer'>
                <input className='commentInput' type='text' placeholder='Type a comment...' value={newCommentText} onChange={event => setNewCommentText(event.target.value)}/>
                <button className='newCommentButton' onClick={sendComment}>Submit</button>
            </div>
        </div>
    )
}