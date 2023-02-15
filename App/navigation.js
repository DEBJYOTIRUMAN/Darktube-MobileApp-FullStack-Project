import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./Screen/LoginScreen";
import SignupScreen from "./Screen/SignupScreen";
import { Provider as ReduxProvider } from "react-redux";
import configureStore from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import ProfileScreen from "./Screen/ProfileScreen";
import SearchScreen from "./Screen/SearchScreen";
import VideoScreen from "./Screen/VideoScreen";
import NewVideoScreen from "./Screen/NewVideoScreen";
import EditVideoScreen from "./Screen/EditVideoScreen";
import DeleteVideoScreen from "./Screen/DeleteVideoScreen";
import VideoSearchScreen from "./Screen/VideoSearchScreen";
import VideoPlayScreen from "./Screen/VideoPlayScreen";
import MovieScreen from "./Screen/MovieScreen";
import MoviePlayScreen from "./Screen/MoviePlayScreen";
import MovieSearchScreen from "./Screen/MovieSearchScreen";
import PopularScreen from "./Screen/PopularScreen";
import InitialScreen from "./Screen/InitialScreen";
import RefreshToken from "./RefreshToken";

const { store, persistor } = configureStore();
const Stack = createStackNavigator();
const screenOptions = {
  headerShown: false,
};

const SignedInStack = () => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RefreshToken />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="InitialScreen"
            screenOptions={screenOptions}
          >
            <Stack.Screen name="InitialScreen" component={InitialScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen name="VideoScreen" component={VideoScreen} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            <Stack.Screen name="NewVideoScreen" component={NewVideoScreen} />
            <Stack.Screen name="MovieScreen" component={MovieScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen
              name="VideoSearchScreen"
              component={VideoSearchScreen}
            />
            <Stack.Screen name="EditVideoScreen" component={EditVideoScreen} />
            <Stack.Screen
              name="DeleteVideoScreen"
              component={DeleteVideoScreen}
            />
            <Stack.Screen name="VideoPlayScreen" component={VideoPlayScreen} />
            <Stack.Screen name="MoviePlayScreen" component={MoviePlayScreen} />
            <Stack.Screen
              name="MovieSearchScreen"
              component={MovieSearchScreen}
            />
            <Stack.Screen name="PopularScreen" component={PopularScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </ReduxProvider>
  );
};

export default SignedInStack;
