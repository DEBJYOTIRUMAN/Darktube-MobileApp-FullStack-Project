import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, FlatList, ImageBackground } from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import Movie from "../Components/movie/Movie";
import * as ScreenOrientation from "expo-screen-orientation";
import { useIsFocused } from "@react-navigation/native";
import BottomTabs from "../Components/utility/BottomTabs";

const MovieScreen = ({ navigation }) => {
  const { profile } = useSelector((state) => state.profileReducer);
  const [movies, setMovies] = useState([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    if(isFocused){
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    fetch("https://darkvilla.onrender.com/api/movie", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((allMovies) => {
        setMovies(allMovies);
      });
    }
  }, [isFocused]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground source={require("../assets/image/background1.jpg")} style={{flex: 1}} resizeMode="cover">
      <MovieHeader navigation={navigation} profile={profile} movies={movies} />
      <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
      <FlatList
            data={movies}
            renderItem={({ item }) => (
                <View
                    style={{
                        margin: 5,
                    }}
                >
                    <Movie movie={item} navigation={navigation} />
                </View>
            )}
            keyExtractor={(item) => item._id}
            numColumns={3}
            showsVerticalScrollIndicator={false}
        />
      </View>
      <BottomTabs
        navigation={navigation}
        tabName="Movie"
      />
      </ImageBackground>
    </SafeAreaView>
  );
};
const MovieHeader = ({ navigation, profile, movies }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity>
        <Image
          style={styles.logo}
          source={require("../assets/header-logo.png")}
        />
      </TouchableOpacity>

      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => navigation.push("MovieSearchScreen")}>
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

        <TouchableOpacity onPress={() => navigation.push("PopularScreen", {
          data: movies,
          screenName: "Popular Movies"
        })}>
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
    backgroundColor: "white",
    flex: 1,
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
export default MovieScreen;
