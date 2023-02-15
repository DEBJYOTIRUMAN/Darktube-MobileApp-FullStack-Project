import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddNewVideo from "../Components/post-video/AddNewVideo";
import BottomTabs from "../Components/utility/BottomTabs";

const NewVideoScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground
        source={require("../assets/image/background1.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <AddNewVideo navigation={navigation} />
        <View style={styles.wrapper}>
          <BottomTabs navigation={navigation} tabName="Upload" />
        </View>
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
