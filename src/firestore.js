import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { uploadImage } from "./storage";

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