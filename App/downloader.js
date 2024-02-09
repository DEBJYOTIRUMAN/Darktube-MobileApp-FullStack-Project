import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { throttle } from "lodash";

const downloader = async (fileUrl, fileName, onProgress, setProgress) => {
  const permissions = await MediaLibrary.requestPermissionsAsync();

  if (!permissions.granted) {
    return;
  }

  try {
    const throttledOnProgress = throttle(onProgress, 1000);
    const downloadResumable = FileSystem.createDownloadResumable(
      fileUrl,
      FileSystem.documentDirectory + fileName,
      {},
      throttledOnProgress
    );

    const { uri } = await downloadResumable.downloadAsync();

    MediaLibrary.createAssetAsync(uri)
      .then(() => {
        alert("Download Complete");
      })
      .catch((error) => {
        alert("Download Failed");
      })
      .finally(() => {
        setProgress(0);
      });
  } catch (error) {
    console.error(error);
    setProgress(0);
  }
};

export default downloader;