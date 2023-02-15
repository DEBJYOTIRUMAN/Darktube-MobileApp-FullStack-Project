import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
const downloader = async (fileUrl, fileName) => {
  const permissions = await MediaLibrary.requestPermissionsAsync();
  if (!permissions.granted) {
    return;
  }
  alert("Your download has started.")
  try {
    const { uri } = await FileSystem.downloadAsync(
      fileUrl,
      FileSystem.documentDirectory + fileName,
      {
        sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
      }
    );
    MediaLibrary.createAssetAsync(uri)
      .then(() => {
        alert("Download Complete");
      })
      .catch((error) => {
        alert("Download Failed");
      });
  } catch (error) {
    console.error(error);
  }
};
export default downloader;
