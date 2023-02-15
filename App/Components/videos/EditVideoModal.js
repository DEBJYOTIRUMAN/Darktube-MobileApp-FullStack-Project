import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Divider } from "react-native-elements";

export default function EditVideoModal({ video, setModalVisible, navigation }) {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalCheckoutContainer}>
        <VideoDetails video={video} setModalVisible={setModalVisible} />
        <View
          style={{
            flex: 1,
            justifyContent: "space-evenly",
            marginHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false), navigation.push("EditVideoScreen", video);
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Image
              source={require("../../assets/icons/edit.png")}
              style={{ width: 32, height: 32 }}
            />
            <Text style={{ color: "white", fontSize: 18, marginLeft: 10 }}>
              Edit Video
            </Text>
          </TouchableOpacity>
          <Divider width={1} />
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false),
                navigation.push("DeleteVideoScreen", video);
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Image
              source={require("../../assets/icons/delete.png")}
              style={{ width: 32, height: 32 }}
            />
            <Text style={{ color: "white", fontSize: 18, marginLeft: 10 }}>
            Delete Video
            </Text>
          </TouchableOpacity>
          <Divider width={1} />
        </View>
      </View>
    </View>
  );
}
const VideoDetails = ({ video, setModalVisible }) => (
  <>
    <View style={{ marginHorizontal: 20, marginTop: 20 }}>
      <View style={{ alignItems: "center" }}>
        <Image
          source={{ uri: video.thumbnailUrl }}
          style={{ width: 150, height: 150, borderRadius: 5 }}
        />
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          {video.title}
        </Text>
        {video.likes.length !== 0 ? (
          <Text
            style={{
              color: "#eee",
              fontSize: 16,
            }}
          >
            {video.likes.length} likes
          </Text>
        ) : (
          <Text
            style={{
              color: "#eee",
              fontSize: 16,
            }}
          >
            0 likes
          </Text>
        )}
      </View>
      <Divider width={1} style={{ marginTop: 10 }} />
    </View>

    <TouchableOpacity
      onPress={() => setModalVisible(false)}
      style={{ width: "10%", position: "absolute", right: 10, top: 20 }}
    >
      <Image
        source={require("../../assets/icons/cancel.png")}
        style={{ width: 24, height: 24 }}
      />
    </TouchableOpacity>
  </>
);
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  modalCheckoutContainer: {
    height: 380,
    backgroundColor: "black",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    marginRight: 23,
  },
});
