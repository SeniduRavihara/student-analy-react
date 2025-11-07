import { storage } from "@/firebase/config";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";

export class StorageService {
  /**
   * Upload question image to Firebase Storage
   * @param file - Image file to upload
   * @param mcqTestId - MCQ test ID
   * @param questionId - Question ID
   * @returns Promise<string> - Download URL
   */
  static async uploadQuestionImage(
    file: File,
    mcqTestId: string,
    questionId: string
  ): Promise<string> {
    try {
      const fileExtension = file.name.split(".").pop() || "jpg";
      const fileName = `question-image.${fileExtension}`;
      const storagePath = `mcqTests/${mcqTestId}/questions/${questionId}/${fileName}`;

      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading question image:", error);
      throw new Error("Failed to upload question image");
    }
  }

  /**
   * Upload option image to Firebase Storage
   * @param file - Image file to upload
   * @param mcqTestId - MCQ test ID
   * @param questionId - Question ID
   * @param optionLetter - Option letter (A, B, C, D)
   * @returns Promise<string> - Download URL
   */
  static async uploadOptionImage(
    file: File,
    mcqTestId: string,
    questionId: string,
    optionLetter: string
  ): Promise<string> {
    try {
      const fileExtension = file.name.split(".").pop() || "jpg";
      const fileName = `option-${optionLetter}.${fileExtension}`;
      const storagePath = `mcqTests/${mcqTestId}/questions/${questionId}/options/${fileName}`;

      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading option image:", error);
      throw new Error("Failed to upload option image");
    }
  }

  /**
   * Delete question image from Firebase Storage
   * @param mcqTestId - MCQ test ID
   * @param questionId - Question ID
   */
  static async deleteQuestionImage(
    mcqTestId: string,
    questionId: string
  ): Promise<void> {
    try {
      const storagePath = `mcqTests/${mcqTestId}/questions/${questionId}`;
      const folderRef = ref(storage, storagePath);

      // List all files in the question folder
      const listResult = await listAll(folderRef);

      // Delete all files in the folder
      const deletePromises = listResult.items.map((item) => deleteObject(item));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting question images:", error);
      // Don't throw error as this is cleanup operation
    }
  }

  /**
   * Delete entire MCQ test folder from Firebase Storage
   * @param mcqTestId - MCQ test ID
   */
  static async deleteMCQTestFolder(mcqTestId: string): Promise<void> {
    try {
      const storagePath = `mcqTests/${mcqTestId}`;
      const folderRef = ref(storage, storagePath);

      // List all files in the MCQ test folder
      const listResult = await listAll(folderRef);

      // Delete all files recursively
      const deletePromises = listResult.items.map((item) => deleteObject(item));
      await Promise.all(deletePromises);

      // Also delete subfolders recursively
      for (const folder of listResult.prefixes) {
        const subListResult = await listAll(folder);
        const subDeletePromises = subListResult.items.map((item) =>
          deleteObject(item)
        );
        await Promise.all(subDeletePromises);
      }
    } catch (error) {
      console.error("Error deleting MCQ test folder:", error);
      // Don't throw error as this is cleanup operation
    }
  }

  /**
   * Delete specific image by URL
   * @param imageUrl - Full image URL to delete
   */
  static async deleteImageByUrl(imageUrl: string): Promise<void> {
    try {
      // Extract the storage path from the URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);

      if (pathMatch) {
        const storagePath = decodeURIComponent(pathMatch[1]);
        const imageRef = ref(storage, storagePath);
        await deleteObject(imageRef);
      }
    } catch (error) {
      console.error("Error deleting image by URL:", error);
      // Don't throw error as this is cleanup operation
    }
  }
}
