let defaultState = {
    profile: {}
  };
let profileReducer = (state = defaultState, action) => {
    switch(action.type) {
        case "ADD_PROFILE": {
            let newState = { ...state };
            newState.profile = {
                ...action.payload.profileData
            }
            // console.log(newState, "👉");
            return newState;
        }
        case "CLEAR_PROFILE": {
            return defaultState;
        }
        default:
        return state;
    }
};
export default profileReducer;