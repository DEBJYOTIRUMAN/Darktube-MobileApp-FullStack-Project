import {
  View,
  Image,
  TextInput,
  Button,
  Modal,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Divider } from "react-native-elements";
import { useSelector } from "react-redux";
import ImageUploadModal from "./ImageUploadModal";
import VideoUploadModal from "./VideoUploadModal";
import axios from "axios";
import LottieView from "lottie-react-native";
let title = "";
const uploadVideoSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Title has reached the character limit.")
    .min(6, "Title must be at least 6 characters.")
    .required(),
});

const FormikVideoUploader = ({ navigation }) => {
  const [imageModal, setImageModal] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [localVideo, setLocalVideo] = useState("");
  const [localImage, setLocalImage] = useState("");
  const [submit, setSubmit] = useState(false);
  const { token } = useSelector((state) => state.tokenReducer);
  const [progress, setProgress] = useState(0);
  // Store New Video
  useEffect(() => {
    const store = async () => {
      if (!submit) {
        return;
      }

      if (localImage === "") {
        setSubmit(false);
        return;
      }

      if (localVideo === "") {
        setSubmit(false);
        return;
      }

      if (!token.access_token) {
        setSubmit(false);
        return;
      }

      let thumbnailName = localImage.split("/").pop();
      let videoName = localVideo.split("/").pop();
      let thumbnailMatch = /\.(\w+)$/.exec(thumbnailName);
      let videoMatch = /\.(\w+)$/.exec(videoName);
      let thumbnailType = thumbnailMatch
        ? `image/${thumbnailMatch[1]}`
        : `image`;
      let videoType = videoMatch ? `video/${videoMatch[1]}` : `video`;
      let formData = new FormData();
      formData.append("title", title);
      formData.append("thumbnail", {
        uri: localImage,
        name: thumbnailName,
        type: thumbnailType,
      });
      formData.append("video", {
        uri: localVideo,
        name: videoName,
        type: videoType,
      });
      try {
        const response = await axios.post(
          "https://darkvilla.onrender.com/api/video",
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
        setSubmit(false);
        navigation.push("VideoScreen");
      } catch (error) {
        Alert.alert("Video too large!", "Video file must be under 2 GB.");
        setSubmit(false);
        navigation.push("VideoScreen");
      }
    };
    store();
  }, [submit]);
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Formik
        initialValues={{ title: "" }}
        onSubmit={(values) => {
          title = values.title;
          setSubmit(true);
        }}
        validationSchema={uploadVideoSchema}
        validateOnMount={true}
      >
        {({ handleBlur, handleChange, handleSubmit, values, isValid }) => (
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
                  source={
                    localImage === ""
                      ? require("../../assets/placeholder_image.jpg")
                      : {
                          uri: localImage,
                        }
                  }
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
            {localVideo === "" ? (
              <TouchableOpacity
                style={{
                  width: "95%",
                  alignSelf: "center",
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
                onPress={() => setVideoModal(true)}
              >
                <Text
                  style={{
                    padding: 10,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  ADD NEW VIDEO
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  width: "95%",
                  alignSelf: "center",
                  backgroundColor: "#eee",
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    padding: 10,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  VIDEO ADDED
                </Text>
              </View>
            )}

            <Divider
              width={1}
              orientation="vertical"
              style={{ marginTop: 25 }}
            />
            <View
              style={{
                marginTop: 25,
                width: "25%",
                alignSelf: "flex-end",
                marginHorizontal: 5,
              }}
            >
              {localImage === "" || localVideo === "" || progress > 0 ? (
                <Button title="SHARE" disabled={true} />
              ) : (
                <Button
                  onPress={handleSubmit}
                  title="SHARE"
                  disabled={!isValid}
                />
              )}
            </View>
          </>
        )}
      </Formik>
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
      {/* Video Upload Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={videoModal}
        onRequestClose={() => setVideoModal(false)}
      >
        <VideoUploadModal
          setVideoModal={setVideoModal}
          setLocalVideo={setLocalVideo}
        />
      </Modal>
      {progress > 0 ? (
        <View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "black",
            position: "absolute",
            opacity: 0.8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LottieView
            style={{ height: 200 }}
            source={require("../../assets/animations/loading.json")}
            autoPlay
          />
          <View style={{ position: "absolute" }}>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
              {progress}%
            </Text>
          </View>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default FormikVideoUploader;
