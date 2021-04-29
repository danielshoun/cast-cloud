import './CommentPopup.css';
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {csrfFetch} from "../../../store/csrf";

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
        const res = await csrfFetch(`/api/episodes/${audioState.queue[audioState.currentTrack].id}/comments`, {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json();
    }

    return (
        <div className='commentPopupContainer'>
            <div className='commentHeader'>Comments</div>
            <div className='commentContent'>
                {comments.length === 0 ?
                    <div className='emptyCommentContent'>
                        {audioState.currentTrack !== null ? 'No comments for this episode yet.' : 'You must select an episode first.'}
                    </div> :
                    comments.map(comment => {
                        return (
                            <div key={comment.id} className='commentListItem'>
                                <div className='commentItemHeader'>
                                    <span className='commentUser'>{comment.User.username}</span>
                                    <span className='commentTimestamp'>{comment.timestamp}</span>
                                </div>
                                <div className='commentText'>
                                    {comment.text}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className='newCommentContainer'>
                <input className='commentInput' type='text' placeholder='Type a comment...' value={newCommentText} onChange={event => setNewCommentText(event.target.value)}/>
                <button className='newCommentButton' onClick={sendComment}>Submit</button>
            </div>
        </div>
    )
}