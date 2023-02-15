import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch } from "react-redux";

const ProfileHeader = ({ navigation }) => {
  const dispatch = useDispatch();
  const signOut = () => {
    alert("Logout Success.");
    dispatch({
        type: "CLEAR_TOKEN",
    });
    dispatch({
        type: "CLEAR_USER",
    });
    dispatch({
        type: "CLEAR_PROFILE",
    });
    
    navigation.navigate("LoginScreen");
};
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons name="keyboard-backspace" size={30} color="white" />
      </TouchableOpacity>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 21,
          color: "white",
          alignSelf: "center",
        }}
      >
        Profile
      </Text>
      <TouchableOpacity
        onPress={() => signOut()}
        style={{
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons name="logout" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;
