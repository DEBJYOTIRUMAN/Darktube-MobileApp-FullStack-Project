import { combineReducers } from "redux";
import profileReducer from "./profileReducer";
import tokenReducer from "./tokenReducer";
import userReducer from "./userReducer";

let reducers = combineReducers({
  userReducer: userReducer,
  tokenReducer: tokenReducer,
  profileReducer: profileReducer,
});

const rootReducer = (state, action) => {
  return reducers(state, action);
};

export default rootReducer;
