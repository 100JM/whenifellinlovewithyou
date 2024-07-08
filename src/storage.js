import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export const uploadImage = async (file) => {
    if (!file) return null;

    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

export const uploadVideo = async (file) => {
    if (!file) return null;

    const storageRefVideo = ref(storage, `videos/${file.name}`);
    await uploadBytes(storageRefVideo, file);
    const downloadURL = await getDownloadURL(storageRefVideo);
    return downloadURL;
};