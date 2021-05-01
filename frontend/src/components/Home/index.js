import './Home.css';
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";

export default function Home() {
    const userState = useSelector(state => state.session)
    const [podcasts, setPodcasts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('/api/podcasts');
            const data = await res.json();
            setPodcasts(data);
        }
        fetchData().then();
    }, [])

    return (
        <div className='homeContainer'>
            <img className='homeLogo' alt='CastCloud Logo' src='/logo.png'/>
            <h1 className='welcomeHeader'>Welcome to <span className='siteName'>CastCloud</span></h1>
            <h3 className='welcomeSubHeader'>
                Use the search bar to start listening right away.
                {userState.user ?
                    <> Go to <Link className='welcomeLink' to='/feed'>your feed</Link> for the latest of your favorites.<br/></> :
                    <> <Link className='welcomeLink' to='/login'>Log in</Link> or <Link className='welcomeLink' to='/signup'>create an account</Link> to start subscribing.<br/></>
                }
                Need some suggestions? Check out some of our most popular podcasts below!
            </h3>
            <div className='popularContainer'>
                {podcasts.map(podcast => {
                    return (
                        <div key={podcast.id} className='podcastContainer'>
                            <Link to={`/podcasts/${podcast.itunesId}`}>
                                <img className='homePodcastImage' alt={podcast.title} src={podcast.artworkUrl}/>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}