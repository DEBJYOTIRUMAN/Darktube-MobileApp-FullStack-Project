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

export default function FollowingModal({
  setFollowingVisible,
  navigation,
  allFollowing,
}) {
  const [following, setFollowing] = useState([]);
  const { token } = useSelector((state) => state.tokenReducer);
  useEffect(() => {
    if (!token.access_token) {
      return;
    }
    fetch("https://darkvilla.onrender.com/api/profile/following", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`,
      },
      body: JSON.stringify({ following: allFollowing }),
    })
      .then((res) => res.json())
      .then((documents) => {
        setFollowing(documents);
      });
  }, []);
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalCheckoutContainer}>
        <ImageBackground source={require("../../assets/image/background3.jpg")} style={{ flex: 1 }} resizeMode="cover">
        <ModalHeader setFollowingVisible={setFollowingVisible} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Following
            navigation={navigation}
            setFollowingVisible={setFollowingVisible}
            following={following}
          />
        </ScrollView>
        </ImageBackground>
      </View>
      <StatusBar backgroundColor="#eee" />
    </View>
  );
}
const ModalHeader = ({ setFollowingVisible }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => setFollowingVisible(false)}>
      <Image
        source={require("../../assets/icons/back.png")}
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
    <Text style={styles.headerText}>Following</Text>
    <Text></Text>
  </View>
);

const Following = ({ following, navigation, setFollowingVisible }) => {
  return (
    <>
      {following.map((profile, index) => (
        <TouchableOpacity
          style={{ flexDirection: "row", marginHorizontal: 15, marginTop: 25 }}
          key={index}
          onPress={() => {
            navigation.push("ProfileScreen", profile),
            setFollowingVisible(false);
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
    flex: 1
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
