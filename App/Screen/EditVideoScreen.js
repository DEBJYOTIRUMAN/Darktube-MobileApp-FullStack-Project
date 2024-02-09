import { Formik } from "formik";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
  Modal,
  ImageBackground,
  Alert,
} from "react-native";
import { Divider } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import ImageUploadModal from "../Components/post-video/ImageUploadModal";
import axios from "axios";
import LottieView from "lottie-react-native";

export default function EditVideoScreen({ navigation, route }) {
  const video = route.params;
  const uploadVideoSchema = Yup.object().shape({
    title: Yup.string()
      .max(50, "Title has reached the character limit.")
      .min(6, "Title must be at least 6 characters.")
      .required(),
  });
  const { token } = useSelector((state) => state.tokenReducer);
  const [imageModal, setImageModal] = useState(false);
  const [localImage, setLocalImage] = useState(video.thumbnailUrl);
  const [progress, setProgress] = useState(0);
  const submitUpdateVideo = async (title) => {
    if (!token.access_token) {
      return;
    }
    let thumbnailName = localImage.split("/").pop();
    let thumbnailMatch = /\.(\w+)$/.exec(thumbnailName);
    let thumbnailType = thumbnailMatch ? `image/${thumbnailMatch[1]}` : `image`;
    if (thumbnailName.split(".").pop() == "jpeg") {
      thumbnailName = `${thumbnailName.split(".")[0]}.jpg`;
    }
    if (thumbnailType == "image/jpeg") {
      thumbnailType = "image/jpg";
    }
    let formData = new FormData();
    formData.append("title", title);
    formData.append("thumbnail", {
      uri: localImage,
      name: thumbnailName,
      type: thumbnailType,
    });
    try {
      const response = await axios.put(
        `https://darkvilla.onrender.com/api/video/update/${video._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token.access_token}`,
          },
          onUploadProgress: ({ loaded, total }) =>
            setProgress(Math.floor((loaded * 100) / total)),
        }
      );
      setProgress(0);
      navigation.push("VideoScreen");
    } catch (error) {
      Alert.alert("Oops, something went wrong. Maybe file is too large.");
      setProgress(0);
      navigation.push("VideoScreen");
    }
  };
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <ImageBackground
          source={require("../assets/image/background1.jpg")}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          <View style={{ marginTop: 5 }}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={require("../assets/icons/back.png")}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Edit Video</Text>
              <Text></Text>
            </View>
            {/* Update Video */}
              <Formik
                initialValues={{ title: video.title }}
                onSubmit={(values) => {
                  submitUpdateVideo(values.title);
                }}
                validationSchema={uploadVideoSchema}
                validateOnMount={true}
              >
                {({
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  values,
                  isValid,
                }) => (
                  <>
                    <View
                      style={{
                        margin: 20,
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      <TouchableOpacity
                        style={{ width: 100, height: 100 }}
                        onPress={() => setImageModal(true)}
                      >
                        <Image
                          source={{ uri: localImage }}
                          style={{ width: "100%", height: "100%" }}
                        />
                      </TouchableOpacity>

                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <TextInput
                          style={{ color: "white", fontSize: 20 }}
                          placeholder="Write a title..."
                          placeholderTextColor="gray"
                          multiline={true}
                          onChangeText={handleChange("title")}
                          onBlur={handleBlur("title")}
                          value={values.title}
                        />
                      </View>
                    </View>
                    <Divider
                      width={1}
                      orientation="vertical"
                      style={{ marginTop: 25, marginHorizontal: 10 }}
                    />
                    <View style={{ marginTop: 25, marginHorizontal: 10 }}>
                      {video.title === values.title &&
                      localImage === video.thumbnailUrl ? (
                        <Button title="Update Video" disabled={true} />
                      ) : (
                        <Button
                          onPress={handleSubmit}
                          title="Update Video"
                          disabled={!isValid}
                        />
                      )}
                    </View>
                  </>
                )}
              </Formik>
          </View>
          {progress > 0 && progress < 100 ? (
          <View
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              backgroundColor: "#000",
              opacity: 0.8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LottieView
              style={{ height: 200 }}
              source={require("../assets/animations/loading.json")}
              autoPlay
            />
            <View style={{ position: "absolute" }}>
              <Text
                style={{ color: "white", fontSize: 24, fontWeight: "bold" }}
              >
                {progress}%
              </Text>
            </View>
          </View>
        ) : (
          <></>
        )}
        </ImageBackground>
      </SafeAreaView>
      {/* Image Upload Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={imageModal}
        onRequestClose={() => setImageModal(false)}
      >
        <ImageUploadModal
          setImageModal={setImageModal}
          setLocalImage={setLocalImage}
        />
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
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