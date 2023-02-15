import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import BottomTabs from "../Components/utility/BottomTabs";
const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const { token } = useSelector((state) => state.tokenReducer);
  const [searchData, setSearchData] = useState([]);
  useEffect(() => {
    if (!token.access_token) {
      return;
    }
    if (query.length < 3) {
      return;
    }
    fetch(`https://darkvilla.onrender.com/api/profile/search/${query}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSearchData(data);
      });
  }, [query]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground source={require("../assets/image/background1.jpg")} style={{flex: 1}} resizeMode="cover">
      <View style={styles.container}>
        <Header navigation={navigation} />
      </View>
      <View
        style={{ marginTop: 30, flexDirection: "row", marginHorizontal: 10 }}
      >
        <GooglePlacesAutocomplete
          placeholder="Search"
          textInputProps={{
            onChangeText: (text) => setQuery(text),
            value: query,
          }}
          styles={{
            textInput: {
              backgroundColor: "#eee",
              borderRadius: 20,
              fontWeight: "700",
              marginTop: 7,
            },
            textInputContainer: {
              backgroundColor: "#eee",
              borderRadius: 50,
              flexDirection: "row",
              alignItems: "center",

              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.18,
              shadowRadius: 1.0,

              elevation: 1,
            },
          }}
          renderLeftButton={() => (
            <View
              style={{
                marginLeft: 10,
              }}
            >
              <Ionicons name="search-sharp" size={24} />
            </View>
          )}
          renderRightButton={() => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                marginRight: 8,
                backgroundColor: "white",
                padding: 9,
                borderRadius: 30,
                alignItems: "center",
              }}
              onPress={() => {
                setQuery("");
              }}
            >
              <AntDesign
                name="closecircle"
                size={11}
                style={{ marginRight: 6 }}
              />
              <Text style={{ fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {query.length < 3 ? (
        <></>
      ) : (
        <SearchResult
          searchData={searchData}
          navigation={navigation}
          setQuery={setQuery}
        />
      )}
      <View style={styles.wrapper}>
        <BottomTabs navigation={navigation} tabName="Search" />
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
const Header = ({ navigation }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image
        source={require("../assets/icons/back.png")}
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
    <Text style={styles.headerText}>Search</Text>
    <Text></Text>
  </View>
);
const SearchResult = ({ searchData, navigation, setQuery }) => (
  <View
    style={{
      width: "100%",
      paddingHorizontal: 15,
      alignSelf: "center",
    }}
  >
    <FlatList
      data={searchData}
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
            setQuery("");
            navigation.push("ProfileScreen", item);
          }}
        >
          <View style={{ width: "92%", flexDirection: "row" }}>
            <Image source={{ uri: item.profilePic }} style={styles.story} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                marginHorizontal: 10,
                textAlignVertical: "center",
                color: "white",
              }}
            >
              {item.userName}
            </Text>
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
    marginTop: 5
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
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#ff8501",
  },
  wrapper: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    zIndex: 999,
  },
});
export default SearchScreen;
