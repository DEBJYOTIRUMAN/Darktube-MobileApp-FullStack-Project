import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Divider } from "react-native-elements";
export default function VideoUploadModal({ setVideoModal, setLocalVideo }) {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
        setLocalVideo(result.uri);
    }
    setVideoModal(false)
  };
  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
        setLocalVideo(result.uri);
    }
    setVideoModal(false)
  }
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalCheckoutContainer}>
      <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            justifyContent: "space-between",
            marginHorizontal: 10,
          }}
        >
          <Text style={{ width: "10%" }}></Text>
          <Text
            style={{
              fontSize: 20,
              color: "white",
              fontWeight: "bold",
              width: "80%",
              textAlign: "center",
            }}
          >
            Upload Video
          </Text>
          <TouchableOpacity
            onPress={() => setVideoModal(false)}
            style={{ width: "10%", alignItems: "center" }}
          >
            <Image
              source={require("../../assets/icons/cancel.png")}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "space-evenly",
            marginHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setVideoModal(false);
              pickImage();
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Image
              source={require("../../assets/icons/image.png")}
              style={{ width: 35, height: 35 }}
            />
            <Text style={{ color: "white", fontSize: 18, marginLeft: 10 }}>
              Gallery
            </Text>
          </TouchableOpacity>
          <Divider width={1} />
          <TouchableOpacity
            onPress={() => {
              setVideoModal(false);
              openCamera();
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Image
              source={require("../../assets/icons/video.png")}
              style={{ width: 35, height: 35 }}
            />
            <Text style={{ color: "white", fontSize: 18, marginLeft: 10 }}>
              Camera
            </Text>
          </TouchableOpacity>
          <Divider width={1} />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  modalCheckoutContainer: {
    height: 200,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 40,
    backgroundColor: "black",
  },
});
