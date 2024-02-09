import { Image, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import MovieOptionModal from "./MovieOptionModal";

const Movie = ({ movie, navigation, setProgress }) => {
  const [movieOptionModal, setMovieOptionModal] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={{
          width: 120,
          height: 160,
        }}
        onPress={() => navigation.push("MoviePlayScreen", movie)}
      >
        <Image
          source={{ uri: movie.thumbnailUrl }}
          style={{ width: "100%", height: "100%", borderRadius: 10 }}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 0,
            width: 30,
            height: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setMovieOptionModal(true)}
        >
          <Image
            source={require("../../assets/icons/menu.png")}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={movieOptionModal}
        onRequestClose={() => setMovieOptionModal(false)}
      >
        <MovieOptionModal
          movie={movie}
          setMovieOptionModal={setMovieOptionModal}
          navigation={navigation}
          setProgress={setProgress}
        />
      </Modal>
    </>
  );
};

export default Movie;