import React from "react";

export default function Play(props) {
    const { handleClick } = props;

    return (
        <button className="playerButton" onClick={() => handleClick()}>
            <i className="fas fa-play-circle"/>
        </button>
    );
}
