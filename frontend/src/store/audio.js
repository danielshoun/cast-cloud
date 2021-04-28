const CHANGE_TRACK = 'audio/changeTrack';
const TOGGLE_AUDIO_PLAYING = 'audio/togglePlaying';
const ADD_TO_QUEUE = 'audio/addToQueue';
const GO_TO_NEXT = 'audio/goToNextSong';
const REMOVE_FROM_QUEUE = 'audio/removeFromQueue';
const SKIP_TO_SONG = 'audio/skipToSong';

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

export const removeFromQueue = (index) => {
    return {
        type: REMOVE_FROM_QUEUE,
        index
    }
}

export const skipToSong = (index) => {
    return {
        type: SKIP_TO_SONG,
        index
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
            if(newState.queue.length > 1) {
                newState.queue.splice(state.currentTrack, 1)
                if(newState.currentTrack === newState.queue.length) {
                    newState.currentTrack = 0;
                }
            } else {
                newState.queue = [];
                newState.currentTrack = null;
                newState.playing = false;
            }
            return newState;
        case REMOVE_FROM_QUEUE:
            if(action.index === newState.currentTrack) {
                if(newState.queue.length > 1) {
                    newState.queue.splice(state.currentTrack, 1)
                    if(newState.currentTrack === newState.queue.length) {
                        newState.currentTrack = 0;
                    }
                } else {
                    newState.queue = [];
                    newState.currentTrack = null;
                    newState.playing = false;
                }
            } else {
                newState.queue.splice(action.index, 1);
                if(action.index < newState.currentTrack) {
                    newState.currentTrack = state.currentTrack - 1;
                }
            }
            return newState;
        case SKIP_TO_SONG:
            newState.currentTrack = action.index;
            return newState;
        default:
            return state;
    }
}