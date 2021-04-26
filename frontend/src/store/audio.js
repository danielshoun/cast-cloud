const CHANGE_TRACK = 'audio/changeTrack';

export const changeTrack = (newSrc) => {
    return {
        type: CHANGE_TRACK,
        newSrc
    }
}

export default function audioReducer(state = {}, action) {
    let newState = Object.assign({}, state);
    switch(action.type) {
        case CHANGE_TRACK:
            newState.currentTrack = action.newSrc;
            return newState;
        default:
            return state;
    }
}