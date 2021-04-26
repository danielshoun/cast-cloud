import {useEffect, useState} from "react";

export default function EpisodeList({ itunesId }) {
    const [episodeList, setEpisodeList] = useState([]);

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

    return (
        <>
            {episodeList.items.map(episode => {
                return <div key={episode.guid}>{episode.title}</div>
            })}
        </>
    )
}