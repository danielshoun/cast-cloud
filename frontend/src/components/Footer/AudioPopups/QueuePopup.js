import './QueuePopup.css';
import {useSelector} from "react-redux";

export default function QueuePopup() {
    const audioState = useSelector(state => state.audio);

    return (
        <div className='queuePopupContainer'>
            <div className='queueHeader'>Up next...</div>
            <div className='queueContent'>
                {audioState.queue.length === 0 ?
                    <div className='emptyQueueContent'>
                        Your queue is currently empty.
                    </div> :
                    <div className='queueListContainer'>
                        {audioState.queue.map(episode => {
                            return (
                                <div key={episode.guid} className='queueListItem'>
                                    <img alt='Album Artwork' className='queueItemImage' src={episode.artworkUrl}/>
                                    <div className='queueItemText'>
                                        <div className='queueItemTitle'>{episode.title}</div>
                                        <div className='queueItemArtist'>{episode.podcastTitle}</div>
                                    </div>
                                    <div className='queueItemActions'>
                                        <i className="fas fa-ellipsis-v queueItemButton"/>
                                        <i className="fas fa-trash-alt queueItemButton"/>
                                    </div>
                                </div>
                            )
                        })}
                    </div>}
            </div>
        </div>
    )
}