import './CommentPopup.css';
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {csrfFetch} from "../../../store/csrf";
import Comment from "./Comment";

export default function CommentPopup() {
    const audioState = useSelector(state => state.audio);
    const currentEpisode = audioState.queue[audioState.currentTrack]
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/episodes/${currentEpisode.id}/comments`);
            const data = await res.json();
            setComments(data);
        }
        if(audioState.currentTrack !== null) {
            fetchData().then();
        }
    }, [currentEpisode, audioState.currentTrack])

    async function sendComment() {
        if(!newCommentText) return;
        const comment = {
            episodeId: currentEpisode.id,
            text: newCommentText,
            timestamp: audioState.currentAudioRef.currentTime
        }
        const res = await csrfFetch(`/api/episodes/${currentEpisode.id}/comments`, {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json();
        let insertPoint = comments.findIndex(el => el.timestamp > data.timestamp);
        if(insertPoint === -1) insertPoint = 0;
        setComments(prevState => [...prevState.slice(0, insertPoint), data, ...prevState.slice(insertPoint, prevState.length)]);
        setNewCommentText('');
    }

    function handleEditComment(data) {
        const replacePoint = comments.findIndex(el => el.id === data.id);
        setComments(prevState => [...prevState.slice(0, replacePoint), data, ...prevState.slice(replacePoint + 1, prevState.length)]);
    }

    function handleDeleteComment(comment) {
        const deletePoint = comments.findIndex(el => el.id === comment.id);
        setComments(prevState => [...prevState.slice(0, deletePoint), ...prevState.slice(deletePoint + 1, prevState.length)]);
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
                            <Comment
                                key={comment.id}
                                comment={comment}
                                handleEditComment={handleEditComment}
                                handleDeleteComment={handleDeleteComment}
                            />
                        )
                    })
                }
            </div>
            <div className='newCommentContainer'>
                {currentEpisode ?
                    <>
                        <input className='commentInput' type='text' placeholder='Type a comment...' value={newCommentText} maxLength={500} onChange={event => setNewCommentText(event.target.value)}/>
                        <button className='newCommentButton' onClick={sendComment}>Submit</button>
                    </>
                    : <></>}

            </div>
        </div>
    )
}
