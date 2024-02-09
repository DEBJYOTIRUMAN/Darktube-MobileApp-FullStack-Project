import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EvilIcons from "react-native-vector-icons/EvilIcons";

const fetchVideos = async () => {
  const response = await fetch("https://darkvilla.onrender.com/api/video", {
    method: "GET",
  });
  const data = await response.json();
  return sortedData(data);
};

const fetchMovies = async () => {
  const response = await fetch("https://darkvilla.onrender.com/api/movie", {
    method: "GET",
  });
  const data = await response.json();
  return sortedData(data);
};

const sortedData = (data) => {
  return data
    .sort((a, b) => {
      return b.likes.length - a.likes.length;
    })
    .slice(0, 20);
};

const PopularScreen = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const screenName = route.params.screenName;

  useEffect(() => {
    const fetchData = async () => {
      if (screenName === "Popular Videos") {
        const response = await fetchVideos();
        setData(response);
      } else if (screenName === "Popular Movies") {
        const response = await fetchMovies();
        setData(response);
      }
    };
    fetchData();
  }, [screenName]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground
        source={require("../assets/image/background1.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Header navigation={navigation} screenName={screenName} />
          <PopularList
            navigation={navigation}
            data={data}
            screenName={screenName}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
const Header = ({ navigation, screenName }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image
        source={require("../assets/icons/back.png")}
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
    <Text style={styles.headerText}>{screenName}</Text>
    <Text></Text>
  </View>
);

const PopularList = ({ navigation, data, screenName }) => (
  <View
    style={{
      width: "100%",
      paddingHorizontal: 15,
      alignSelf: "center",
    }}
  >
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{
            height: 80,
            alignItems: "center",
            borderColor: "white",
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottomWidth: 0.5,
          }}
          onPress={() => {
            screenName === "Popular Videos"
              ? navigation.push("VideoPlayScreen", item)
              : navigation.push("MoviePlayScreen", item);
          }}
        >
          <View style={{ width: "92%", flexDirection: "row" }}>
            <Image source={{ uri: item.thumbnailUrl }} style={styles.story} />
            <View style={{ flex: 1, marginHorizontal: 15, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "white",
                }}
              >
                {item.title}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: 25,
              height: 25,
              backgroundColor: "white",
              justifyContent: "center",
              borderRadius: 1000,
            }}
          >
            <EvilIcons name="chevron-right" size={25} />
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
    />
  </View>
);
const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  headerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    marginRight: 23,
  },
  story: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
});
export default PopularScreen;
