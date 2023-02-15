import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const RefreshToken = () => {
  const { token } = useSelector((state) => state.tokenReducer);
  const dispatch = useDispatch();
  const [call, setCall] = useState(true);
  setInterval(() => {
    setCall(true);
  }, 300000);
  useEffect(() => {
    if (!token.refresh_token) {
      setCall(false);
      return;
    }
    if (!call) {
      return;
    }
    fetch("https://darkvilla.onrender.com/api/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: token.refresh_token }),
    })
      .then((res) => res.json())
      .then((tokenData) => {
        dispatch({
          type: "ADD_TOKEN",
          payload: {
            tokenData,
          },
        });
        setCall(false);
      });
  }, [call]);
  return <></>;
};

export default RefreshToken;
