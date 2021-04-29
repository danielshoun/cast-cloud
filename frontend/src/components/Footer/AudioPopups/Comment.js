import React, {useState} from "react";
import {useSelector} from "react-redux";

export default function Comment({comment}) {
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

    return (
        <div className='commentListItem'>
            <div className='commentItemHeader'>
                <span className='commentUser'>{comment.User.username}</span>
                <span className='commentTimestamp'>
                                        {userState.user.id === comment.User.id &&
                                        <span className='commentUserButtonContainer'>
                                                <i className="fas fa-pencil-alt commentUserButton" onClick={() => setIsEditing(true)}/>
                                                <i className="fas fa-times commentUserButton"/>
                                            </span>
                                        }
                    {getTime(comment.timestamp)}
                                    </span>
            </div>
            {isEditing ?
                <input
                    className='editCommentInput'
                    value={editInputValue}
                    onChange={event => setEditInputValue(event.target.value)}/> :
                <div className='commentText'>
                    {comment.text}
                </div>
            }
        </div>
    )
}