import React, {useEffect, useState} from "react";
import EpisodeItem from "./EpisodeItem";

export default function EpisodeList({ podcastData, isSubscribed }) {
    const [listLoaded , setListLoaded] = useState(false);
    const [episodeList, setEpisodeList] = useState(null);
    const [activeEpisode, setActiveEpisode] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/podcasts/${podcastData.id}/episodes`);
            const data = await res.json();
            setEpisodeList(data);
        }
        fetchData().then(() => setListLoaded(true));
    }, [podcastData])

    useEffect(() => {
        if(isSubscribed) {
            async function fetchData() {
                const res = await fetch(`/api/podcasts/${podcastData.id}/episodes`);
                const data = await res.json();
                setEpisodeList(data);
            }
            fetchData().then();
        }
    }, [isSubscribed, podcastData.id])

    function handleActive(episode) {
        if(activeEpisode === episode.guid) {
            setActiveEpisode(null);
        } else {
            setActiveEpisode(episode.guid)
        }
    }

    function modifyEpisodeProgress(newEpisodeProgress) {
        const replacePoint = episodeList.findIndex(episode => episode.id === newEpisodeProgress.episodeId);
        const episode = Object.assign({}, episodeList[replacePoint]);
        episode.EpisodeProgresses = [newEpisodeProgress];
        setEpisodeList(prevState => [...prevState.slice(0, replacePoint), episode, ...prevState.slice(replacePoint + 1, prevState.length)]);

    }

    return (
        <>
            {episodeList?.length > 0 ? episodeList.map((episode, i) => {
                return (
                    <EpisodeItem
                        key={i}
                        activeEpisode={activeEpisode}
                        handleActive={handleActive}
                        episode={episode}
                        podcastData={podcastData}
                        modifyEpisodeProgress={modifyEpisodeProgress}
                    />
                )
            }) : listLoaded ?
                    <div className='emptyListContent'>
                        This podcast's RSS feed is either unavailable or it does not follow standard formatting.
                    </div> :
                    <div className='emptyListContent'>
                        Loading podcast episodes...
                    </div>
            }
        </>
    )
}