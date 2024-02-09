import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Video from "../Components/videos/Video";
import * as ScreenOrientation from "expo-screen-orientation";
import { useIsFocused } from "@react-navigation/native";
import BottomTabs from "../Components/utility/BottomTabs";
const VideoScreen = ({ navigation, route }) => {
  const { profile } = useSelector((state) => state.profileReducer);
  const [videos, setVideos] = useState([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
      if (route.params) {
        setVideos([route.params]);
        return;
      }
      fetch("https://darkvilla.onrender.com/api/video", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((allVideos) => {
          setVideos(allVideos);
        });
    }
  }, [isFocused]);
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/image/background1.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <VideoHeader
          navigation={navigation}
          profile={profile}
        />
        <ScrollView>
          {videos.map((video, index) => (
            <Video
              video={video}
              key={index}
              navigation={navigation}
              profile={profile}
            />
          ))}
        </ScrollView>
        <BottomTabs navigation={navigation} tabName="Home" />
      </ImageBackground>
    </SafeAreaView>
  );
};
const VideoHeader = ({ navigation, profile }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity>
        <Image
          style={styles.logo}
          source={require("../assets/header-logo.png")}
        />
      </TouchableOpacity>

      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => navigation.push("NewVideoScreen")}>
          <Image
            source={require("../assets/icons/plus.png")}
            style={{
              width: 30,
              height: 30,
              marginLeft: 10,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.push("PopularScreen", {
              screenName: "Popular Videos",
            })
          }
        >
          <Image
            source={require("../assets/icons/like_normal.png")}
            style={{
              width: 30,
              height: 30,
              marginLeft: 10,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.push("VideoSearchScreen")}>
          <Image
            source={require("../assets/icons/ios_search.png")}
            style={{
              width: 30,
              height: 30,
              marginLeft: 10,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.push("ProfileScreen", profile)}
        >
          <Image
            source={{ uri: profile.profilePic }}
            style={{
              width: 30,
              height: 30,
              marginLeft: 10,
              borderRadius: 20,
              borderWidth: 3,
              borderColor: "white",
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  headerContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 20,
  },
  iconsContainer: {
    flexDirection: "row",
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
});
export default VideoScreen;