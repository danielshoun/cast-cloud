import {useHistory, useLocation} from 'react-router-dom';
import {useEffect, useState} from "react";
import './SearchResults.css';

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

export default function SearchResults() {
    const query = useQuery();
    const term = query.get('term');
    const history = useHistory();
    const [podcasts, setPodcasts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/podcasts/search?term=${term}`);
            const data = await res.json();
            setPodcasts(data);
        }
        fetchData().then();
    }, [term])
    return (
        <div className='searchResultContainer'>
            <table className='searchResultTable'>
                <thead>
                    <tr className='resultRow'>
                        <th>Artwork</th>
                        <th>Title</th>
                        <th>Episodes</th>
                    </tr>
                </thead>
                <tbody>
                    {podcasts.map(podcast => {
                        return (
                            <tr key={podcast.collectionId} className='resultRow' onClick={() => history.push(`/podcasts/${podcast.collectionId}`)}>
                                <td className='imageCell'>
                                    <img src={podcast.artworkUrl100} alt={podcast.collectionName}/>
                                </td>
                                <td className='titleCell'>
                                    <span className='tableTitle'>{podcast.collectionName}</span>
                                </td>
                                <td className='episodeCell'>
                                    <span className='tableCount'>{podcast.trackCount}</span>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}