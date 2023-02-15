import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useSelector } from "react-redux";
import LikesModal from "../Components/videos/LikesModal";
import { Divider } from "react-native-elements";
import CommentsModal from "../Components/videos/CommentsModal";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoPlay from "../Components/videos/VideoPlay";
import downloader from "../downloader";

const VideoPlayScreen = ({ navigation, route }) => {
  const [updateVideo, setUpdateVideo] = useState(route.params);
  const { profile } = useSelector((state) => state.profileReducer);
  const { token } = useSelector((state) => state.tokenReducer);
  const [submitLikes, setSubmitLikes] = useState(false);
  const [inFullscreen, setInFullscreen] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  //Update Video Likes
  useEffect(() => {
    if (!submitLikes) {
      return;
    }
    if (!token.access_token) {
      return;
    }
    let updateLikes = updateVideo.likes;
    if (!updateLikes.includes(profile.userId)) {
      updateLikes.push(profile.userId);
    } else {
      updateLikes = updateLikes.filter((item) => item !== profile.userId);
    }
    fetch(`https://darkvilla.onrender.com/api/video/like/${updateVideo._id}`, {
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
        setUpdateVideo(document);
        setSubmitLikes(false);
      });
  }, [submitLikes]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground
        source={require("../assets/image/background1.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <VideoPlay
          videoUrl={updateVideo.videoUrl}
          inFullscreen={inFullscreen}
          setInFullscreen={setInFullscreen}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          type="video"
        />
        {!inFullscreen ? (
          <>
            <Divider width={1} />
            <VideoTitle updateVideo={updateVideo} />
            <View style={{ padding: 10 }}>
              <VideoDetails
                updateVideo={updateVideo}
                setUpdateVideo={setUpdateVideo}
                setSubmitLikes={setSubmitLikes}
                profile={profile}
                navigation={navigation}
                screenHeight={screenHeight}
              />
              {updateVideo.likes.length !== 0 ? (
                <Likes
                  videoLikes={updateVideo.likes}
                  navigation={navigation}
                  screenHeight={screenHeight}
                />
              ) : (
                <></>
              )}
            </View>
            <Divider width={1} orientation="vertical" />
            <VideoFooter
              updateVideo={updateVideo}
              profile={profile}
              navigation={navigation}
            />
            <Divider width={1} orientation="vertical" />
            <CommentSection
              updateVideo={updateVideo}
              setUpdateVideo={setUpdateVideo}
              setSubmitLikes={setSubmitLikes}
              profile={profile}
              navigation={navigation}
              screenHeight={screenHeight}
            />
            {updateVideo.comments.length !== 0 ? (
              <Comments
                oneComment={updateVideo.comments[0]}
                navigation={navigation}
                profile={profile}
              />
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

const VideoTitle = ({ updateVideo }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      marginTop: 1,
    }}
  >
    <View style={{ width: "92%" }}>
      <Text style={{ fontSize: 17, fontWeight: "bold", color: "white" }}>
        {updateVideo.title}
      </Text>
    </View>
    <View
      style={{ width: "8%", justifyContent: "center", alignItems: "center" }}
    >
      <Image
        source={require("../assets/icons/reel_active.png")}
        style={{ width: 30, height: 30 }}
      />
    </View>
  </View>
);
const VideoDetails = ({
  updateVideo,
  setUpdateVideo,
  setSubmitLikes,
  profile,
  navigation,
  screenHeight,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={styles.leftFooterIconsContainer}>
          {/* Likes */}
          <TouchableOpacity onPress={() => setSubmitLikes(true)}>
            <Image
              style={styles.footerIcon}
              source={
                !updateVideo.likes.includes(profile.userId)
                  ? require("../assets/icons/like_normal.png")
                  : require("../assets/icons/like_heart.png")
              }
            />
          </TouchableOpacity>

          {/* Comments */}
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              style={styles.footerIcon}
              source={require("../assets/icons/comments.png")}
            />
          </TouchableOpacity>
          {/* Video */}
          <View>
            <Image
              style={styles.footerIcon}
              source={require("../assets/icons/headphone.png")}
            />
          </View>
        </View>
        <View>
          {/* Download */}
          <TouchableOpacity
            onPress={() =>
              downloader(
                updateVideo.videoUrl,
                `${updateVideo.title}.${updateVideo.videoUrl.split(".").pop()}`,
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <CommentsModal
          setModalVisible={setModalVisible}
          userId={profile.userId}
          userName={profile.userName}
          profilePic={profile.profilePic}
          updateVideo={updateVideo}
          setUpdateVideo={setUpdateVideo}
          navigation={navigation}
          profile={profile}
          screenHeight={screenHeight}
        />
      </Modal>
    </>
  );
};
const Likes = ({ videoLikes, navigation, screenHeight }) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={{ flexDirection: "row", marginTop: 4 }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          {videoLikes.length} likes
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <LikesModal
          setModalVisible={setModalVisible}
          navigation={navigation}
          videoLikes={videoLikes}
          screenHeight={screenHeight}
        />
      </Modal>
    </>
  );
};
const VideoFooter = ({ updateVideo, profile, navigation }) => {
  const [checkProfile, setCheckProfile] = useState(profile);
  useEffect(() => {
    if (profile.userId === updateVideo.userId) {
      return;
    } else {
      fetch(`https://darkvilla.onrender.com/api/profile/user/${updateVideo.userId}`)
        .then((res) => res.json())
        .then((document) => {
          setCheckProfile(document);
        });
    }
  }, []);

  return (
    <TouchableOpacity
      style={{ flexDirection: "row", margin: 11 }}
      onPress={() => {
        navigation.push("ProfileScreen", checkProfile);
      }}
    >
      <View style={{ width: "14%" }}>
        <Image
          source={{ uri: updateVideo.profilePic }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 50,
            borderColor: "white",
            borderWidth: 3,
          }}
        />
      </View>
      <View style={{ width: "78%", justifyContent: "center" }}>
        <Text
          style={{
            fontWeight: "bold",
            color: "white",
          }}
        >
          {updateVideo.userName}
        </Text>
        <Text style={{ color: "white" }}>
          {checkProfile.followers.length !== 0
            ? `${checkProfile.followers.length} followers`
            : "0 followers"}
        </Text>
      </View>
      <View
        style={{ width: "8%", justifyContent: "center", alignItems: "center" }}
      >
        <EvilIcons name="chevron-right" size={40} color="white" />
      </View>
    </TouchableOpacity>
  );
};
const CommentSection = ({
  updateVideo,
  setUpdateVideo,
  profile,
  navigation,
  screenHeight,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={{ margin: 10 }}
        onPress={() => setModalVisible(true)}
      >
        {!!updateVideo.comments.length && (
          <Text style={{ color: "gray" }}>
            View{updateVideo.comments.length > 1 ? " all" : ""}{" "}
            {updateVideo.comments.length}{" "}
            {updateVideo.comments.length > 1 ? "comments" : "comment"}
          </Text>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <CommentsModal
          setModalVisible={setModalVisible}
          userId={profile.userId}
          userName={profile.userName}
          profilePic={profile.profilePic}
          updateVideo={updateVideo}
          setUpdateVideo={setUpdateVideo}
          navigation={navigation}
          profile={profile}
          screenHeight={screenHeight}
        />
      </Modal>
    </>
  );
};
const Comments = ({ oneComment, navigation, profile }) => {
  const getProfileById = (userId) => {
    if (profile.userId === userId) {
      navigation.push("ProfileScreen", profile);
    } else {
      fetch(`https://darkvilla.onrender.com/api/profile/user/${userId}`)
        .then((res) => res.json())
        .then((profile) => {
          navigation.push("ProfileScreen", profile);
        });
    }
  };
  return (
    <TouchableOpacity
      style={{ flexDirection: "row", marginHorizontal: 11 }}
      onPress={() => getProfileById(oneComment.userId)}
    >
      <View style={{ width: "10%", justifyContent: "center" }}>
        <Image
          source={{ uri: oneComment.profilePic }}
          style={{ width: 30, height: 30, borderRadius: 50 }}
        />
      </View>
      <View style={{ width: "85%", justifyContent: "center" }}>
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            marginHorizontal: 6,
            textAlign: "justify",
          }}
        >
          {oneComment.userName}
          <Text style={{ color: "white", fontWeight: "400" }}>
            {" "}
            {oneComment.comment}
          </Text>
        </Text>
      </View>
      <View
        style={{
          width: "5%",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <Image
          source={require("../assets/icons/dot.png")}
          style={{ width: 16, height: 16 }}
        />
      </View>
    </TouchableOpacity>
  );
};
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
export default VideoPlayScreen;
