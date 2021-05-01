import React, {useState} from "react";
import {useSelector} from "react-redux";
import {csrfFetch} from "../../../store/csrf";

export default function Comment({comment, handleEditComment, handleDeleteComment}) {
    const userState = useSelector(state => state.session);
    const [isEditing, setIsEditing] = useState(false);
    const [editInputValue, setEditInputValue] = useState(comment.text);

    function getTime(time) {
        let hours = Math.floor(time / 3600);
        time = time - hours * 3600;
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time - minutes * 60);
        return `${hours < 10 ? '0' + hours.toString(10) : hours}:` +
            `${minutes < 10 ? '0' + minutes.toString(10) : minutes}:` +
            `${seconds < 10 ? '0' + seconds.toString(10) : seconds}`;
    }

    async function handleEditInputKeys(event) {
        if(event.key === 'Enter' && editInputValue) {
            const updatedComment = {
                text: editInputValue
            }
            const res = await csrfFetch(`/api/comments/${comment.id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedComment),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            handleEditComment(data);
            setIsEditing(false);
        } else if(event.key === 'Escape') {
            setIsEditing(false);
            setEditInputValue(comment.text);
        }
    }

    async function handleDeleteButton(comment) {
        await csrfFetch(`/api/comments/${comment.id}`, {
            method: 'DELETE'
        })
        handleDeleteComment(comment);
    }

    return (
        <div className='commentListItem'>
            <div className='commentItemHeader'>
                <span className='commentUser'>{comment.User.username}</span>
                <span className='commentTimestamp'>
                                        {userState.user.id === comment.User.id &&
                                        <span className='commentUserButtonContainer'>
                                                <i
                                                    className="fas fa-pencil-alt commentUserButton"
                                                    onClick={() => setIsEditing(true)}
                                                />
                                                <i
                                                    className="fas fa-times commentUserButton"
                                                    onClick={() => handleDeleteButton(comment)}
                                                />
                                            </span>
                                        }
                    {getTime(comment.timestamp)}
                                    </span>
            </div>
            {isEditing ?
                <input
                    className='editCommentInput'
                    value={editInputValue}
                    onKeyDown={event => handleEditInputKeys(event)}
                    onChange={event => setEditInputValue(event.target.value)}
                    maxLength={500}
                /> :
                <div className='commentText'>
                    {comment.text}
                </div>
            }
        </div>
    )
}