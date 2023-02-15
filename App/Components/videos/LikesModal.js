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

export default function LikesModal({
  setModalVisible,
  navigation,
  videoLikes,
  screenHeight,
}) {
  const [userProfiles, setUserProfiles] = useState([]);
  useEffect(() => {
    if (videoLikes.length === 0) {
      return;
    }

    fetch("https://darkvilla.onrender.com/api/post/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: videoLikes }),
    })
      .then((res) => res.json())
      .then((documents) => {
        setUserProfiles(documents);
      });
  }, [videoLikes]);

  return (
    <View style={styles.modalContainer}>
      <View
        style={{
          borderWidth: 1,
          backgroundColor: "black",
          height: screenHeight - 201,
        }}
      >
        <ImageBackground
          source={require("../../assets/image/background4.jpg")}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          <ModalHeader setModalVisible={setModalVisible} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Likes
              navigation={navigation}
              setModalVisible={setModalVisible}
              userProfiles={userProfiles}
            />
          </ScrollView>
        </ImageBackground>
      </View>
    </View>
  );
}
const ModalHeader = ({ setModalVisible }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => setModalVisible(false)}>
      <Image
        source={require("../../assets/icons/back.png")}
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
    <Text style={styles.headerText}>Likes</Text>
    <Text></Text>
  </View>
);

const Likes = ({ userProfiles, navigation, setModalVisible }) => {
  return (
    <>
      {userProfiles.map((profile, index) => (
        <TouchableOpacity
          style={{ flexDirection: "row", marginHorizontal: 15, marginTop: 25 }}
          key={index}
          onPress={() => {
            navigation.push("ProfileScreen", profile), setModalVisible(false);
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
              alignItems: "center",
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
    justifyContent: "flex-end",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  headerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    marginRight: 23,
  },
});
