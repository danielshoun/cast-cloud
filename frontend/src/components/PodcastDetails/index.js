import { useParams } from 'react-router-dom';
import {useEffect, useState} from "react";
import './PodcastDetails.css';
import ReviewList from "./ReviewList";
import EpisodeList from "./EpisodeList";

export default function PodcastDetails() {
    const { itunesId } = useParams();
    const [podcastData, setPodcastData] = useState(null);
    const [tabOption, setTabOption] = useState('episodes')

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/podcasts/${itunesId}`);
            const data = await res.json();
            setPodcastData(data);
        }
        fetchData().then();
    }, [itunesId]);

    if(!podcastData) {
        return (
            <>
            </>
        )
    }
    else {

        return (
            <div className='podcastDetailsContainer'>
                <div className='podcastDetailsHeader'>
                    <img className='podcastArtwork' src={podcastData.artworkUrl} alt='Podcast Artwork'/>
                    <div className='podcastInfo'>
                        <div className='podcastInfoHeader'>
                            <span className='podcastTitle'>{podcastData.title}</span>
                            <span className='podcastArtist'>{podcastData.artist}</span>
                        </div>
                        <div className='podcastInfoFooter'>
                            <span className='podcastDescription'>{podcastData.description}</span>
                        </div>
                    </div>
                </div>
                <div className='podcastTabMenu'>
                    <span className='podcastTab' onClick={() => setTabOption('episodes')}>Episodes</span>
                    <span className='podcastTab' onClick={() => setTabOption('reviews')}>Reviews</span>
                </div>
                <div className='podcastList'>
                    {tabOption === 'reviews' ? <ReviewList podcastData={podcastData}/> :
                        <EpisodeList
                            podcastTitle={podcastData.title}
                            artworkUrl={podcastData.artworkUrl}
                            podcastData={podcastData}
                        />}
                </div>
            </div>
        )
    }
}