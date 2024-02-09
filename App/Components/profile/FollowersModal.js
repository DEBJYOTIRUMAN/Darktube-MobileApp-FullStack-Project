import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useSelector } from "react-redux";

export default function FollowersModal({
  setFollowersVisible,
  navigation,
  userFollowers,
}) {
  const [followers, setFollowers] = useState([]);
  const { token } = useSelector((state) => state.tokenReducer);
  useEffect(() => {
    if (!token.access_token) {
      return;
    }
    fetch("https://darkvilla.onrender.com/api/profile/followers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`,
      },
      body: JSON.stringify({ followers: userFollowers }),
    })
      .then((res) => res.json())
      .then((documents) => {
        setFollowers(documents);
      });
  }, []);
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalCheckoutContainer}>
        <ImageBackground source={require("../../assets/image/background3.jpg")} style={{ flex: 1 }} resizeMode="cover">
          <ModalHeader setFollowersVisible={setFollowersVisible} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Followers
              navigation={navigation}
              setFollowersVisible={setFollowersVisible}
              followers={followers}
            />
          </ScrollView>
        </ImageBackground>
      </View>
      <StatusBar backgroundColor="#eee" />
    </View>
  );
}
const ModalHeader = ({ setFollowersVisible }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => setFollowersVisible(false)}>
      <Image
        source={require("../../assets/icons/back.png")}
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
    <Text style={styles.headerText}>Followers</Text>
    <Text></Text>
  </View>
);

const Followers = ({ followers, navigation, setFollowersVisible }) => {
  return (
    <>
      {followers.map((profile, index) => (
        <TouchableOpacity
          style={{ flexDirection: "row", marginHorizontal: 15, marginTop: 25 }}
          key={index}
          onPress={() => {
            navigation.push("ProfileScreen", profile),
              setFollowersVisible(false);
          }}
        >
          <View style={{ width: "15%" }}>
            <Image
              source={{ uri: profile.profilePic }}
              style={{ width: 50, height: 50, borderRadius: 50 }}
            />
          </View>
          <View style={{ width: "75%", justifyContent: "center" }}>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                marginLeft: 8,
              }}
            >
              {profile.userName}
            </Text>
          </View>
          <View
            style={{
              width: "10%",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Image
              source={require("../../assets/icons/dot.png")}
              style={{ width: 20, height: 20 }}
            />
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },

  modalCheckoutContainer: {
    height: "100%",
    backgroundColor: "black",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 15,
  },
  headerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    marginRight: 23,
  },
});
