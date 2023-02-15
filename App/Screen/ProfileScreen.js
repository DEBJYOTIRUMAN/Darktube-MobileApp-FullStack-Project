import React, { useEffect, useState } from "react";
import { ImageBackground, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "react-native-elements";
import ProfileHeader from "../Components/profile/ProfileHeader";
import UserDetails from "../Components/profile/UserDetails";
import { useDispatch, useSelector } from "react-redux";
import VideoContent from "../Components/profile/VideoContent";
import BottomTabs from "../Components/utility/BottomTabs";
const ProfileScreen = ({ navigation, route }) => {
  const { token } = useSelector((state) => state.tokenReducer);
  const { user } = useSelector((state) => state.userReducer);
  const [profile, setProfile] = useState(route.params);
  const [videos, setVideos] = useState([]);
  const [localUri, setLocalUri] = useState("");
  const dispatch = useDispatch();

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
    if (localUri === "") {
      return;
    }
    if (!token.access_token) {
      return;
    }
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append("profilePic", { uri: localUri, name: filename, type });
    fetch("https://darkvilla.onrender.com/api/profile/update_pic", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token.access_token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((profileData) => {
        if (profileData.message === "File too large") {
          alert("File is too large.");
          return;
        }
        dispatch({
          type: "ADD_PROFILE",
          payload: {
            profileData,
          },
        });
      });
  }, [localUri]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground source={require("../assets/image/background3.jpg")} style={{flex: 1}} resizeMode="cover">
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
            {profile.userId === user._id ? "You don't have any video." : "User don't have any video."}
          </Text>
        ) : (
          <VideoContent videos={videos} navigation={navigation} />
        )}
      </ScrollView>
      <BottomTabs navigation={navigation} tabName="Profile" />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ProfileScreen;
