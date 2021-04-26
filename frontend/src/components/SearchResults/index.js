import { useLocation } from 'react-router-dom';
import {useEffect, useState} from "react";
import './SearchResults.css';

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

export default function SearchResults() {
    const query = useQuery();
    const [podcasts, setPodcasts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/podcasts/search?term=${query.get('term')}`);
            const data = await res.json();
            console.log(data);
            setPodcasts(data);
        }
        fetchData();
    }, [query.get('term')])
    return (
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
                        <tr className='resultRow'>
                            <td>
                                <img src={podcast.artworkUrl100}/>
                            </td>
                            <td>
                                <span className='tableTitle'>{podcast.collectionName}</span>
                            </td>
                            <td>
                                <span className='tableCount'>{podcast.trackCount}</span>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}