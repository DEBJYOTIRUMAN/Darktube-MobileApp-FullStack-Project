import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { Divider } from "react-native-elements";
import { useSelector } from "react-redux";

const BottomTabs = ({ navigation, tabName }) => {
  const activeTab = tabName;
  const { profile } = useSelector((state) => state.profileReducer);
  return (
    <View>
      <Divider width={1} orientation="vertical" />
      <View style={styles.container}>
        {/* Home */}
        <TouchableOpacity onPress={() => navigation.push("VideoScreen")}>
          <Image
            source={
              activeTab === "Home"
                ? require("../../assets/icons/home_active.png")
                : require("../../assets/icons/home.png")
            }
            style={styles.icon}
          />
        </TouchableOpacity>
        {/* Search */}
        <TouchableOpacity onPress={() => navigation.push("SearchScreen")}>
          <Image
            source={
              activeTab === "Search"
                ? require("../../assets/icons/search_active.png")
                : require("../../assets/icons/search.png")
            }
            style={styles.icon}
          />
        </TouchableOpacity>
        {/* Video */}
        <TouchableOpacity onPress={() => navigation.push("NewVideoScreen")}>
          <Image
            source={
              activeTab === "Upload"
                ? require("../../assets/icons/plus_active.png")
                : require("../../assets/icons/plus.png")
            }
            style={styles.icon}
          />
        </TouchableOpacity>
        {/* Movie */}
        <TouchableOpacity onPress={() => navigation.push("MovieScreen")}>
          <Image
            source={
              activeTab === "Movie"
                ? require("../../assets/icons/movie_active.png")
                : require("../../assets/icons/movie.png")
            }
            style={styles.icon}
          />
        </TouchableOpacity>
        {/* Profile */}
        <TouchableOpacity
          onPress={() => navigation.push("ProfileScreen", profile)}
        >
          <Image
            source={{ uri: profile.profilePic }}
            style={[
              styles.icon,
              styles.profilePic(),
              activeTab === "Profile" ? styles.profilePic(activeTab) : null,
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
    paddingTop: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  profilePic: (activeTab = "") => ({
    borderRadius: 50,
    borderWidth: activeTab === "Profile" ? 2 : 0,
    borderColor: "#fff",
  }),
});
export default BottomTabs;
