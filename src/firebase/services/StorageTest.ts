import { storage } from "@/firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export class StorageTest {
  /**
   * Test Firebase Storage connection
   */
  static async testStorageConnection(): Promise<boolean> {
    try {
      console.log("Testing Firebase Storage connection...");

      // Create a simple test file
      const testContent = "Hello Firebase Storage!";
      const testFile = new Blob([testContent], { type: "text/plain" });

      // Try to upload to a test location
      const testRef = ref(storage, "test/connection-test.txt");
      const snapshot = await uploadBytes(testRef, testFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("✅ Firebase Storage is working!");
      console.log("Download URL:", downloadURL);

      return true;
    } catch (error) {
      console.error("❌ Firebase Storage test failed:", error);
      return false;
    }
  }

  /**
   * Test with a small image file
   */
  static async testImageUpload(): Promise<boolean> {
    try {
      console.log("Testing image upload...");

      // Create a small test image (1x1 pixel PNG)
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 1, 1);
      }

      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              const testRef = ref(storage, "test/image-test.png");
              const snapshot = await uploadBytes(testRef, blob);
              const downloadURL = await getDownloadURL(snapshot.ref);

              console.log("✅ Image upload test successful!");
              console.log("Download URL:", downloadURL);
              resolve(true);
            } catch (error) {
              console.error("❌ Image upload test failed:", error);
              resolve(false);
            }
          } else {
            console.error("❌ Failed to create test image blob");
            resolve(false);
          }
        }, "image/png");
      });
    } catch (error) {
      console.error("❌ Image upload test failed:", error);
      return false;
    }
  }
}
