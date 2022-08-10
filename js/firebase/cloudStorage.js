import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";

export async function saveFile(file, folder) {
    try {
        // Upload the image to Cloud Storage.
        const filePath = `${folder}/${
            Date.now().toString(36) + Math.random().toString(36).substr(2)
        }`;
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

export async function deleteFileByURL(url) {
    // Create a reference to the file to delete
    const desertRef = ref(getStorage(), url);

    // Delete the file
    deleteObject(desertRef)
        .then(() => {
            // File deleted successfully
        })
        .catch((error) => {
            // Uh-oh, an error occurred!
        });
}
