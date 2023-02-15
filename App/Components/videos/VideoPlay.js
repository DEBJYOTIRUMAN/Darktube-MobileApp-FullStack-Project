import React, { useState, useRef } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import VideoPlayer from "expo-video-player";
import * as ScreenOrientation from "expo-screen-orientation";
import { setStatusBarHidden } from "expo-status-bar";

const VideoPlay = ({
  videoUrl,
  inFullscreen,
  setInFullscreen,
  screenWidth,
  screenHeight,
  type,
}) => {
  const filename = videoUrl.split("/").pop();
  let serverUrl = "";
  if (type === "video") {
    serverUrl = `https://darkvilla.onrender.com/api/video/${filename}`;
  } else {
    serverUrl = `https://darkvilla.onrender.com/api/movie/${filename}`;
  }
  const video = useRef(null);
  const [fullScreen, setFullScreen] = useState(false);
  const posMillis = useRef(0);
  const [showControls, setShowControls] = useState(false);
  const handlePlaybackCallback = (status) => {
    if (status.isPlaying) {
      posMillis.current = parseInt(status.positionMillis);
    }
  };
  const onForwardPress = () => {
    video.current.playFromPositionAsync(posMillis.current + 10000);
  };
  const onBackwardPress = () => {
    video.current.playFromPositionAsync(posMillis.current - 10000);
  };
  const handleControls = () => {
    setShowControls(!showControls);
    setTimeout(() => {
      setShowControls(false);
    }, 400);
  };
  return (
    <View style={{ height: 200 }}>
      <VideoPlayer
        videoProps={{
          shouldPlay: true,
          resizeMode: !fullScreen ? "contain" : "cover",
          source: {
            uri: serverUrl,
          },
          ref: video,
        }}
        fullscreen={{
          inFullscreen: inFullscreen,
          enterFullscreen: async () => {
            setStatusBarHidden(true, "fade");
            setInFullscreen(!inFullscreen);
            await ScreenOrientation.lockAsync(
              ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
            );
            video.current.setStatusAsync({
              shouldPlay: false,
            });
          },
          exitFullscreen: async () => {
            setStatusBarHidden(false, "fade");
            setInFullscreen(!inFullscreen);
            await ScreenOrientation.lockAsync(
              ScreenOrientation.OrientationLock.DEFAULT
            );
          },
        }}
        style={{
          videoBackgroundColor: "black",
          height: inFullscreen ? screenWidth : 200,
          width: inFullscreen ? screenHeight : screenWidth,
        }}
        playbackCallback={handlePlaybackCallback}
        slider={{
          minimumTrackTintColor: "#6495ed",
          maximumTrackTintColor: "#FFFFFF",
          thumbTintColor: "#6495ed",
        }}
      />
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 0,
          right: 5,
          zIndex: 999,
          width: 50,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => setFullScreen(!fullScreen)}
      >
        <Image
          source={require("../../assets/icons/cover.png")}
          style={{ width: 25, height: 25, zIndex: 100 }}
        />
      </TouchableOpacity>

      {inFullscreen ? (
        !showControls ? (
          <View
            style={{
              position: "absolute",
              width: "100%",
              flexDirection: "row",
              height: screenWidth,
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              onPress={() => handleControls()}
              style={{ width: 200, height: 200 }}
            ></TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleControls()}
              style={{ width: 200, height: 200 }}
            ></TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              position: "absolute",
              width: "100%",
              flexDirection: "row",
              height: screenWidth,
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              onPress={() => onBackwardPress()}
              style={{
                width: 200,
                height: 200,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../assets/icons/forward.png")}
                style={{ width: 45, height: 45, transform: [{ scaleX: -1 }] }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onForwardPress()}
              style={{
                width: 200,
                height: 200,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../assets/icons/forward.png")}
                style={{ width: 45, height: 45 }}
              />
            </TouchableOpacity>
          </View>
        )
      ) : (
        <></>
      )}
    </View>
  );
};

export default VideoPlay;
