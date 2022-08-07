import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";

export default async function saveImage(file) {
    try {
        // Upload the image to Cloud Storage.
        const filePath = file.name;
        const newImageRef = ref(getStorage(), filePath);
        const fileSnapshot = await uploadBytesResumable(newImageRef, file);

        // Generate a public URL for the file.
        const publicImageUrl = await getDownloadURL(newImageRef);
        return publicImageUrl;
    } catch (error) {
        console.error(
            "There was an error uploading a file to Cloud Storage:",
            error
        );
    }
}
