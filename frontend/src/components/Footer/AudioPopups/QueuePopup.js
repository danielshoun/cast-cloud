import './QueuePopup.css';
import {useSelector, useDispatch} from "react-redux";
import {removeFromQueue, skipToSong} from "../../../store/audio";
import React from "react";

export default function QueuePopup() {
    const audioState = useSelector(state => state.audio);
    const dispatch = useDispatch();

    function handleDelete(e, i) {
        e.stopPropagation();
        console.log('Deleting at ', i);
        dispatch(removeFromQueue(i));
    }

    return (
        <div className='queuePopupContainer'>
            <div className='queueHeader'>Your Queue</div>
            <div className='queueContent'>
                {audioState.queue.length === 0 ?
                    <div className='emptyQueueContent'>
                        Your queue is currently empty.
                    </div> :
                    <div className='queueListContainer'>
                        {audioState.queue.map((episode, i) => {
                            return (
                                <div key={episode.guid} className={`queueListItem${audioState.currentTrack === i ? ' activeItem' : ''}`} onClick={() => dispatch(skipToSong(i))}>
                                    <img alt='Album Artwork' className='queueItemImage' src={episode.artworkUrl}/>
                                    <div className='queueItemText'>
                                        <div className='queueItemTitle'>{episode.title}</div>
                                        <div className='queueItemArtist'>{episode.podcastTitle}</div>
                                    </div>
                                    <div className='queueItemActions'>
                                        <i className="fas fa-ellipsis-v queueItemButton"/>
                                        <i className="fas fa-trash-alt queueItemButton" onClick={(e) => handleDelete(e, i)}/>
                                    </div>
                                </div>
                            )
                        })}
                    </div>}
            </div>
        </div>
    )
}