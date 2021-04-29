import './CommentPopup.css';
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";

export default function CommentPopup() {
    const audioState = useSelector(state => state.audio);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/episodes/${audioState.queue[audioState.currentTrack].guid}/comments`);
            const data = await res.json();
            setComments(data);
        }
        if(audioState.currentTrack !== null) {
            fetchData().then();
        }
    }, [audioState.queue[audioState.currentTrack]])

    return (
        <div className='commentPopupContainer'>
            <div className='commentHeader'>Comments</div>
            <div className='commentContent'>
                {comments.length === 0 ?
                    <div className='emptyCommentContent'>
                        {audioState.currentTrack !== null ? 'No comments for this song yet.' : 'You must select a song first.'}
                    </div> :
                    <div>
                    </div>
                }
            </div>
            <div className='newCommentContainer'>
                <input className='commentInput' type='text' placeholder='Type a comment...'/>
                <button className='newCommentButton'>Submit</button>
            </div>
        </div>
    )
}