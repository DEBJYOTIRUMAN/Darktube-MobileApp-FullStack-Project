import { View, Image, TouchableOpacity, Modal, Text } from "react-native";
import React, { useState } from "react";
import { Divider } from "react-native-elements";
import EditVideoModal from "./EditVideoModal";
const Video = ({ video, navigation, profile }) => {
  return (
    <>
      <View style={{ marginBottom: 10 }}>
        <Divider width={1} orientation="vertical" />
        <TouchableOpacity
          onPress={() => navigation.push("VideoPlayScreen", video)}
        >
          <VideoThumbnail video={video} />
          <VideoFooter
            video={video}
            navigation={navigation}
            profile={profile}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};
const VideoThumbnail = ({ video }) => {
  return (
    <Image
      source={{ uri: video.thumbnailUrl }}
      style={{ width: "100%", height: 200 }}
    />
  );
};
const VideoFooter = ({ video, navigation, profile }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const getProfileById = (Id) => {
    if (profile.userId === Id) {
      navigation.push("ProfileScreen", profile);
    } else {
      fetch(`https://darkvilla.onrender.com/api/profile/user/${Id}`)
        .then((res) => res.json())
        .then((profile) => {
          navigation.push("ProfileScreen", profile);
        });
    }
  };
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 10,
          marginVertical: 15,
        }}
      >
        <TouchableOpacity
          style={{ width: "10%", justifyContent: "center", marginLeft: 2, alignItems: 'center' }}
          onPress={() => getProfileById(video.userId)}
        >
          <Image
            source={{ uri: video.profilePic }}
            style={{ width: 36, height: 36, borderRadius: 50 }}
          />
        </TouchableOpacity>
        <View style={{ width: "84%", justifyContent: "center" }}>
          <Text
            style={{
              fontWeight: "bold",
              marginHorizontal: 10,
              color: "white",
            }}
          >
            {video.title}
          </Text>
          <Text style={{ marginHorizontal: 10, color: "#eee", fontSize: 10 }}>
            {video.userName}
          </Text>
        </View>
        {video.userId === profile.userId ? (
          <TouchableOpacity
            style={{
              width: "6%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setModalVisible(true)}
          >
            <Image
              source={require("../../assets/icons/menu.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: "6%", justifyContent: "center" }}>
            <Image
              source={require("../../assets/icons/menu.png")}
              style={{ width: 20, height: 20 }}
            />
          </View>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <EditVideoModal
          video={video}
          setModalVisible={setModalVisible}
          navigation={navigation}
        />
      </Modal>
    </>
  );
};

export default Video;
