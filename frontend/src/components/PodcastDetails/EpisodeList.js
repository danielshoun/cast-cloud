import {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import {changeTrack} from "../../store/audio";

export default function EpisodeList({ itunesId, podcastTitle, artworkUrl }) {
    const dispatch = useDispatch();
    const [episodeList, setEpisodeList] = useState([]);
    const [activeEpisode, setActiveEpisode] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/podcasts/${itunesId}/episodes`);
            const data = await res.json();
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
            dispatch(changeTrack({podcastTitle, artworkUrl, title: episode.title, url: episode.enclosure.url, type: episode.enclosure.type}))
        }
    }
    console.log(artworkUrl);
    return (
        <>
            {episodeList.items.map(episode => {

                return (

                    <div key={episode.guid} className='episodeContainer' onClick={() => handleActive(episode)}>
                        <div className='episodeHeader'>
                            <span className='episodeTitle'>{episode.title}</span>
                            <span className='episodeDuration'>{episode.duration}</span>
                        </div>
                        {activeEpisode === episode.guid && (
                            <div>
                                <div className='episodeDescription'>{episode.itunes.summary || episode.contentSnippet}</div>
                            </div>
                        )}
                    </div>
                )
            })}
        </>
    )
}