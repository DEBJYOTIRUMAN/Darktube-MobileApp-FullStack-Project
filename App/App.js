import SignedInStack from "./navigation";
import { LogBox } from "react-native";
export default function App() {
  LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
  LogBox.ignoreLogs(["Can't perform a React state update on an unmounted component."]);
  LogBox.ignoreAllLogs();
  return <SignedInStack />;
}
