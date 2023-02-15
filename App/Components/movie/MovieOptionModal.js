import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Divider } from "react-native-elements";
import downloader from "../../downloader";
export default function MovieOptionModal({
  movie,
  setMovieOptionModal,
  navigation,
}) {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalCheckoutContainer}>
        <MovieDetails movie={movie} setMovieOptionModal={setMovieOptionModal} />
        <View
          style={{
            flex: 1,
            justifyContent: "space-evenly",
            marginHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setMovieOptionModal(false),
                navigation.push("MoviePlayScreen", movie);
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>Play Movie</Text>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity
            onPress={() => {
              setMovieOptionModal(false),
                downloader(
                  movie.movieUrl,
                  `${movie.title}.${movie.movieUrl.split('.').pop()}`
                );
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>Download</Text>
          </TouchableOpacity>
          <Divider />
        </View>
      </View>
    </View>
  );
}
const MovieDetails = ({ movie, setMovieOptionModal }) => (
  <>
    <View style={{ marginHorizontal: 20, marginTop: 20 }}>
      <View style={{ alignItems: "center" }}>
        <Image
          source={{ uri: movie.thumbnailUrl }}
          style={{ width: 150, height: 150, borderRadius: 5 }}
        />
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 12,
            textAlign: "center",
          }}
        >
          {movie.title}
        </Text>
        <View style={{ flexDirection: "row", marginTop: 4 }}>
          {movie.genres.map((genre, index) => (
            <Text style={{ color: "#eee", fontSize: 16 }} key={index}>
              {genre}
              {movie.genres.length > index + 1 ? " | " : ""}
            </Text>
          ))}
        </View>
      </View>
      <Divider width={1} orientation="vertical" style={{ marginTop: 20 }} />
    </View>

    <TouchableOpacity
      onPress={() => setMovieOptionModal(false)}
      style={{ width: "10%", position: "absolute", right: 10, top: 20 }}
    >
      <Image
        source={require("../../assets/icons/cancel.png")}
        style={{ width: 24, height: 24 }}
      />
    </TouchableOpacity>
  </>
);
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  modalCheckoutContainer: {
    height: 400,
    backgroundColor: "black",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    marginRight: 23,
  },
});
