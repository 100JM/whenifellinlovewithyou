import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { uploadImage, uploadVideo } from "./storage";

export const addDocumentWithImage = async (data, imageFile) => {
    try {
        const imageURL = await uploadImage(imageFile);
        const docData = { ...data, image: imageURL };
        const docRef = await addDoc(collection(db, 'Memories'), docData);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
};

export const addDocumentWithVideo = async (data, videoFile, thumbnail) => {
    try {
        const videoURL = await uploadVideo(videoFile);
        const thumbnailURL = await uploadImage(thumbnail);
        const docData = { ...data, video: videoURL, image: thumbnailURL };
        // const docData = { ...data, video: videoURL };
        const docRef = await addDoc(collection(db, 'Memories'), docData);
        return docRef.id;
    }catch(error) {
        console.error("Error adding document: ", error);
        throw error;
    }
};

export const updateDocument = async (docId, data, imageFile, videoFile) => {
    try {
        const docRef = doc(db, 'Memories', docId);
        const updatedData = { ...data };

        if (imageFile) {
            const imageURL = await uploadImage(imageFile);
            updatedData.image = imageURL;
        }

        if (videoFile) {
            const videoURL = await uploadVideo(videoFile);
            updatedData.video = videoURL;
        }

        await updateDoc(docRef, updatedData);
        console.log("Document updated with ID: ", docId);
    } catch (error) {
        console.error("Error updating document: ", error);
        throw error;
    }
};