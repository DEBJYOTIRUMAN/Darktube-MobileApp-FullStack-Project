let defaultState = {
    user: {}
  };
let userReducer = (state = defaultState, action) => {
    switch(action.type) {
        case "ADD_USER": {
            let newState = { ...state };
            newState.user = {
                ...action.payload.userData
            }
            // console.log(newState, "👉");
            return newState;
        }
        case "CLEAR_USER": {
            return defaultState;
        }
        default:
        return state;
    }
};
export default userReducer;