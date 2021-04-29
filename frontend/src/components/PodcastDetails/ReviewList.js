import {useEffect, useState} from "react";

export default function ReviewList({podcastData}) {
    const [reviewList, setReviewList] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/podcasts/${podcastData.id}/reviews`);
            const data = await res.json();
            console.log(data);
            setReviewList(data);
        }
        fetchData().then();
    }, [podcastData])

    return (
        <>
            {reviewList.map(review => {
                return (
                    <div key={review.id}>review.text</div>
                )
            })}
        </>
    )
}