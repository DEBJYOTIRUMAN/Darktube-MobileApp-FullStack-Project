import React, { useState } from "react";
import { ImageBackground, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddNewVideo from "../Components/post-video/AddNewVideo";
import LottieView from "lottie-react-native";
import BottomTabs from "../Components/utility/BottomTabs";

const NewVideoScreen = ({ navigation }) => {
  const [progress, setProgress] = useState(0);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground
        source={require("../assets/image/background1.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <AddNewVideo navigation={navigation} progress={progress} setProgress={setProgress} />
        <View style={styles.wrapper}>
          <BottomTabs navigation={navigation} tabName="Upload" />
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
  );
};

export default NewVideoScreen;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    zIndex: 999,
  },
});