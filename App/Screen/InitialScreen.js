import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const InitialScreen = ({ navigation }) => {
  const { token } = useSelector((state) => state.tokenReducer);
  useEffect(() => {
    if (!token.refresh_token) {
      return navigation.push("LoginScreen");
    } else {
      return navigation.push("VideoScreen");
    }
  }, []);
  return <></>;
};

export default InitialScreen;
