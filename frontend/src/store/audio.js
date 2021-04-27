const CHANGE_TRACK = 'audio/changeTrack';
const TOGGLE_AUDIO_PLAYING = 'audio/togglePlaying'

export const changeTrack = (newSrc) => {
    return {
        type: CHANGE_TRACK,
        newSrc
    }
}

export const togglePlaying = (playing) => {
    return {
        type: TOGGLE_AUDIO_PLAYING,
        playing
    }
}

export default function audioReducer(state = { currentTrack: '', playing: false}, action) {
    let newState = Object.assign({}, state);
    switch(action.type) {
        case CHANGE_TRACK:
            newState.currentTrack = action.newSrc;
            return newState;
        case TOGGLE_AUDIO_PLAYING:
            newState.playing = action.playing;
            return newState;
        default:
            return state;
    }
}