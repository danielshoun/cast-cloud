import {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import {changeTrack} from "../../store/audio";

export default function EpisodeList({ itunesId }) {
    const dispatch = useDispatch();
    const [episodeList, setEpisodeList] = useState([]);
    const [activeEpisode, setActiveEpisode] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/podcasts/${itunesId}/episodes`);
            const data = await res.json();
            console.log(data);
            setEpisodeList(data);
        }
        fetchData().then();
    }, [itunesId])

    if(episodeList.length === 0) {
        return (<></>)
    }

    function handleActive(episode) {
        if(activeEpisode === episode.guid) {
            setActiveEpisode(null);
        } else {
            setActiveEpisode(episode.guid)
            dispatch(changeTrack({url: episode.enclosure.url, type: episode.enclosure.type}))
        }
    }

    return (
        <>
            {episodeList.items.map(episode => {
                return (
                    <div key={episode.guid} className='episodeContainer' onClick={() => handleActive(episode)}>
                        <div className='episodeHeader'>
                            <span className='episodeTitle'>{episode.title}</span>
                            <span className='episodeDuration'>{episode.itunes.duration}</span>
                        </div>
                        {activeEpisode === episode.guid && (
                            <div>
                                {/*<audio controls>*/}
                                {/*    <source src={episode.enclosure.url} type={episode.enclosure.type}/>*/}
                                {/*</audio>*/}
                                <div className='episodeDescription'>{episode.itunes.summary || episode.contentSnippet}</div>
                            </div>
                        )}
                    </div>
                )
            })}
        </>
    )
}