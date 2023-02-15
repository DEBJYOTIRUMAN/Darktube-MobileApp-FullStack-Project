import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoPlay from "../Components/videos/VideoPlay";
import { useSelector } from "react-redux";
import { Divider } from "react-native-elements";
import downloader from "../downloader";
const MoviePlayScreen = ({ route }) => {
  const [movie, setMovie] = useState(route.params);
  const { token } = useSelector((state) => state.tokenReducer);
  const { profile } = useSelector((state) => state.profileReducer);
  const [inFullscreen, setInFullscreen] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [submitLikes, setSubmitLikes] = useState(false);
  //Update Movie Likes
  useEffect(() => {
    if (!submitLikes) {
      return;
    }
    if (!token.access_token) {
      return;
    }
    let updateLikes = movie.likes;
    if (!updateLikes.includes(profile.userId)) {
      updateLikes.push(profile.userId);
    } else {
      updateLikes = updateLikes.filter((item) => item !== profile.userId);
    }
    fetch(`https://darkvilla.onrender.com/api/movie/like/${movie._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`,
      },
      body: JSON.stringify({
        likes: updateLikes,
      }),
    })
      .then((res) => res.json())
      .then((document) => {
        setMovie(document);
        setSubmitLikes(false);
      });
  }, [submitLikes]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground source={require("../assets/image/background1.jpg")} style={{flex: 1}} resizeMode="cover">
      <VideoPlay
        videoUrl={movie.movieUrl}
        inFullscreen={inFullscreen}
        setInFullscreen={setInFullscreen}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        type="movie"
      />
      {!inFullscreen ? (
        <>
          <Divider width={1} orientation="vertical" />
          <MovieTitle title={movie.title} />
          <View style={{ padding: 10 }}>
            <MovieDetails
              movie={movie}
              setSubmitLikes={setSubmitLikes}
              profile={profile}
            />
            {movie.likes.length !== 0 ? (
              <Likes videoLikes={movie.likes} />
            ) : (
              <></>
            )}
          </View>
          <VideoFooter movie={movie} />
        </>
      ) : (
        <></>
      )}
      </ImageBackground>
    </SafeAreaView>
  );
};
const MovieTitle = ({ title }) => (
  <View style={{ flexDirection: "row", alignItems: "center", margin: 10 }}>
    <View
      style={{ width: "8%", justifyContent: "center", alignItems: "center" }}
    >
      <Image
        source={require("../assets/icons/reel.png")}
        style={{ width: 30, height: 30 }}
      />
    </View>

    <View style={{ width: "92%" }}>
      <Text
        style={{
          fontSize: 17,
          fontWeight: "bold",
          color: "white",
          marginLeft: 10,
        }}
      >
        {title}
      </Text>
    </View>
  </View>
);
const MovieDetails = ({ movie, setSubmitLikes, profile }) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
    <View style={styles.leftFooterIconsContainer}>
      {/* Likes */}
      <TouchableOpacity onPress={() => setSubmitLikes(true)}>
        <Image
          style={styles.footerIcon}
          source={
            !movie.likes.includes(profile.userId)
              ? require("../assets/icons/like_normal.png")
              : require("../assets/icons/like_heart.png")
          }
        />
      </TouchableOpacity>
      {/* Video */}
      <View>
        <Image
          style={styles.footerIcon}
          source={require("../assets/icons/headphone.png")}
        />
      </View>
      {/* Shield */}
      <View>
        <Image
          style={styles.footerIcon}
          source={require("../assets/icons/shield.png")}
        />
      </View>
    </View>
    <View>
      {/* Download */}
      <TouchableOpacity
        onPress={() =>
          downloader(
            movie.movieUrl,
            `${movie.title}.${movie.movieUrl.split(".").pop()}`
          )
        }
      >
        <Image
          style={styles.footerIcon}
          source={require("../assets/icons/download.png")}
        />
      </TouchableOpacity>
    </View>
  </View>
);

const Likes = ({ videoLikes }) => (
  <View style={{ flexDirection: "row", marginTop: 4 }}>
    <Text style={{ color: "white", fontWeight: "600" }}>
      {videoLikes.length} likes
    </Text>
  </View>
);

const VideoFooter = ({ movie }) => (
  <View style={{ flexDirection: "row", padding: 10 }}>
    <Image
      source={{ uri: movie.thumbnailUrl }}
      style={{ width: 60, height: 80 }}
    />
    <View style={{ marginHorizontal: 16 }}>
      <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
        {movie.title}
      </Text>
      <View style={{ flexDirection: "row" }}>
        {movie.genres.map((genre, index) => (
          <Text style={{ color: "#eee", fontSize: 16 }} key={index}>
            {genre}
            {movie.genres.length > index + 1 ? " | " : ""}
          </Text>
        ))}
      </View>
      <Text style={{ color: "white" }}>{movie.release} | Free Download</Text>
    </View>
  </View>
);
const styles = StyleSheet.create({
  footerIcon: {
    width: 33,
    height: 33,
  },
  leftFooterIconsContainer: {
    flexDirection: "row",
    width: "32%",
    justifyContent: "space-between",
  },
});
export default MoviePlayScreen;
