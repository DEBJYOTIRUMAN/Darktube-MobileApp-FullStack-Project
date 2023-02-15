let defaultState = {
    token: {}
  };
let tokenReducer = (state = defaultState, action) => {
    switch(action.type) {
        case "ADD_TOKEN": {
            let newState = { ...state };
            newState.token = {
                ...action.payload.tokenData
            }
            // console.log(newState, "👉");
            return newState;
        }
        case "CLEAR_TOKEN": {
            return defaultState;
        }
        default:
        return state;
    }
};
export default tokenReducer;