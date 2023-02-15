import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Divider } from "react-native-elements";
export default function PicUploadModal({
  setModalVisible,
  setLocalUri,
  profilePic,
  localUri,
}) {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalCheckoutContainer}>
        <ImageBackground source={require("../../assets/image/background1.jpg")} style={{ flex: 1 }} resizeMode="cover">
        <ModalHeader setModalVisible={setModalVisible} />
        <ProfileImage profilePic={profilePic} localUri={localUri} />
        <ChangeImage
          setModalVisible={setModalVisible}
          setLocalUri={setLocalUri}
        />
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
    <Text style={styles.headerText}>Profile Photo</Text>
    <Text></Text>
  </View>
);
const ProfileImage = ({ profilePic, localUri }) => (
  <View style={{ width: "100%", height: 450 }}>
    <Image
      source={localUri === "" ? { uri: profilePic } : { uri: localUri }}
      style={{ height: "100%", width: "100%", resizeMode: "contain" }}
    />
  </View>
);
const ChangeImage = ({ setModalVisible, setLocalUri }) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setLocalUri(result.uri);
    }
    setModalVisible(false);
  };
  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      setLocalUri(result.uri);
    }
    setModalVisible(false);
  };
  return (
    <View style={{flex: 1, justifyContent: "flex-end"}}>
      <View
        style={{
          height: 200,
          borderWidth: 1,
          borderColor: "#eee",
          borderRadius: 40,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Edit Profile Photo
        </Text>

        <View
          style={{
            flex: 1,
            justifyContent: "space-evenly",
            marginHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
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
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1
  },

  modalCheckoutContainer: {
    height: "100%",
    backgroundColor: "black"
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
  },
  headerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    marginRight: 23,
  },
});
