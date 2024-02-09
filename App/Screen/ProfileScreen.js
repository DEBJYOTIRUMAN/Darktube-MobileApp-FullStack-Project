import React, { useEffect, useState } from "react";
import { ImageBackground, ScrollView, Text, Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "react-native-elements";
import ProfileHeader from "../Components/profile/ProfileHeader";
import UserDetails from "../Components/profile/UserDetails";
import { useDispatch, useSelector } from "react-redux";
import VideoContent from "../Components/profile/VideoContent";
import BottomTabs from "../Components/utility/BottomTabs";
import axios from "axios";
import LottieView from "lottie-react-native";
const ProfileScreen = ({ navigation, route }) => {
  const { token } = useSelector((state) => state.tokenReducer);
  const { user } = useSelector((state) => state.userReducer);
  const [profile, setProfile] = useState(route.params);
  const [videos, setVideos] = useState([]);
  const [localUri, setLocalUri] = useState("");
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);

  // Get Admin Profile Only
  useEffect(() => {
    if (route.params.userId !== user._id) {
      return;
    }
    if (!token.access_token) {
      return;
    }
    fetch("https://darkvilla.onrender.com/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((profileData) => {
        setProfile(profileData);
        dispatch({
          type: "ADD_PROFILE",
          payload: {
            profileData,
          },
        });
      });
  }, []);

  // User Save Video
  useEffect(() => {
    if (!token.access_token) {
      return;
    }
    fetch(`https://darkvilla.onrender.com/api/video/user/${profile.userId}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((userVideo) => {
        setVideos(userVideo);
      });
  }, []);

  // Update Profile Image
  useEffect(() => {
    const updateProfilePic = async () => {
      try {
        if (localUri === "" || !token.access_token) {
          return;
        }

        let filename = localUri.split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        if (filename.split(".").pop() === "jpeg") {
          filename = `${filename.split(".")[0]}.jpg`;
        }

        if (type === "image/jpeg") {
          type = "image/jpg";
        }

        let formData = new FormData();
        formData.append("profilePic", { uri: localUri, name: filename, type });

        const response = await axios.post(
          "https://darkvilla.onrender.com/api/profile/update_pic",
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
        if (response.data) {
          const profileData = response.data;
          dispatch({
            type: "ADD_PROFILE",
            payload: {
              profileData,
            },
          });
        }
        setProgress(0);
      } catch (error) {
        Alert.alert("Oops, something went wrong. Maybe file is too large.");
        setProgress(0);
      }
    };

    updateProfilePic();
  }, [localUri]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground
        source={require("../assets/image/background3.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <ProfileHeader navigation={navigation} />
        <Divider orientation="vertical" width={1} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <UserDetails
            profile={profile}
            setProfile={setProfile}
            userId={user._id}
            videos={videos}
            navigation={navigation}
            localUri={localUri}
            setLocalUri={setLocalUri}
          />
          <Divider
            orientation="vertical"
            width={1}
            style={{ marginVertical: 16 }}
          />
          {videos.length === 0 ? (
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 10,
              }}
            >
              {profile.userId === user._id
                ? "You don't have any video."
                : "User don't have any video."}
            </Text>
          ) : (
            <VideoContent videos={videos} navigation={navigation} />
          )}
        </ScrollView>
        <BottomTabs navigation={navigation} tabName="Profile" />
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
  );
};

export default ProfileScreen;