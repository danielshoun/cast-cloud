const CHANGE_TRACK = 'audio/changeTrack';
const TOGGLE_AUDIO_PLAYING = 'audio/togglePlaying';
const ADD_TO_QUEUE = 'audio/addToQueue';
const GO_TO_NEXT = 'audio/goToNextSong';

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

export const addToQueue = (track) => {
    return {
        type: ADD_TO_QUEUE,
        track
    }
}

export const goToNextSong = () => {
    return {
        type: GO_TO_NEXT
    }
}

export default function audioReducer(state = { currentTrack: null, playing: false, queue: []}, action) {
    let newState = Object.assign({}, state);
    switch(action.type) {
        case CHANGE_TRACK:
            newState.queue.push(action.newSrc);
            newState.currentTrack = newState.queue.length - 1;
            return newState;
        case TOGGLE_AUDIO_PLAYING:
            newState.playing = action.playing;
            return newState;
        case ADD_TO_QUEUE:
            newState.queue.push(action.track);
            if(!newState.currentTrack) {
                newState.currentTrack = 0;
            }
            return newState;
        case GO_TO_NEXT:
            if(newState.queue.length > state.currentTrack + 1) {
                newState.currentTrack = state.currentTrack + 1;
            } else {
                newState.currentTrack = null;
                newState.playing = false;
            }
            return newState;
        default:
            return state;
    }
}