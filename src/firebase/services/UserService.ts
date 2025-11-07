import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { UserDataType, UserInfoType } from "../../types";
import { db } from "../config";

class UserService {
  static async fetchCurrentUserData(currentUser: User) {
    try {
      const documentRef = doc(db, "users", currentUser.uid);
      const userDataDoc = await getDoc(documentRef);

      if (userDataDoc.exists()) {
        const userData = userDataDoc.data() as UserDataType;
        console.log("Current user data fetched successfully");
        return userData;
      } else {
        console.log("Document does not exist.");
        return null;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //--------------------------------------------------------

  static async getUserRole(uid: string) {
    const documentRef = doc(db, "users", uid);
    const userData = await getDoc(documentRef);

    return userData?.data()?.roles ?? null;
  }

  //--------------------------------------------------------

  static async getRegisteredStatus(uid: string) {
    const documentRef = doc(db, "users", uid);
    const userData = await getDoc(documentRef);

    return userData?.data()?.registered;
  }

  // -------------------------------------------------------

  static async registerStudent(data: UserInfoType, uid: string) {
    const userInfoDocRef = doc(db, "users", uid);

    const regNo = await this.generateIndexNumber(uid, data.examYear);
    // console.log("REG_NO", regNo);
    localStorage.setItem("regNo", regNo);

    try {
      await updateDoc(userInfoDocRef, {
        ...data,
        bDate: data.bDate ? data.bDate.toISOString() : null,
        registered: true,
        regNo: regNo,
      });

      console.log("Student registered successfully:", data);

      // Step 2: Fetch exams relevant to the student's examYear
      if (data.examYear) {
        const examsQuery = query(
          collection(db, "exams"),
          where("examYear", "==", data.examYear),
          where("classType", "in", data.classes)
        );
        const examsSnapshot = await getDocs(examsQuery);

        // Step 3: Batch add the matching exams to the student's exams sub-collection
        const batch = writeBatch(db);

        examsSnapshot.docs.forEach((examDoc) => {
          const examData = examDoc.data();
          const userExamRef = doc(db, `users/${uid}/exams`, examDoc.id);
          batch.set(userExamRef, examData);
        });

        await batch.commit();
        console.log(`Exams for year ${data.examYear} added to user ${uid}`);
      }
    } catch (error) {
      console.error("Error registering student:", error);
    }
  }

  // ----------------------------------------------

  static async fetchUserInfo(uid: string) {
    const userInfoDocRef = doc(db, "users", uid);
    const userInfo = await getDoc(userInfoDocRef);

    return userInfo.data() as UserDataType;
  }

  // ----------------------------------------------

  static async updateUserInfo(uid: string, updatedData: UserInfoType) {
    const userDocRef = doc(db, "users", uid);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { bDate, ...restOfData } = updatedData;
      // Update the user document with the new data
      await updateDoc(userDocRef, {
        ...restOfData,
        bDate: updatedData.bDate ? updatedData.bDate.toISOString() : null,
      });

      console.log("User information updated successfully.");
    } catch (error) {
      console.error("Error updating user information:", error);
      throw error; // Optionally, you could handle the error here, depending on your use case
    }
  }

  static async generateIndexNumber(uid: string, examYear: string) {
    const userGeneralInfoDocRef = doc(db, "general", examYear);
    console.log(uid);

    try {
      const regNo = await runTransaction(db, async (transaction) => {
        const userGeneralInfoDoc = await transaction.get(userGeneralInfoDocRef);

        if (!userGeneralInfoDoc.exists()) {
          throw new Error("Document does not exist!");
        }

        const data = userGeneralInfoDoc.data();
        const lastRegNo = data.lastRegNo || 0;

        // Generate new registration number with exam year prefix
        const newRegNo = examYear + String(lastRegNo + 1).padStart(3, "0");

        // Update the document with the new last registration number
        transaction.update(userGeneralInfoDocRef, {
          lastRegNo: lastRegNo + 1,
        });

        return newRegNo;
      });

      console.log(`Generated Index Number: ${regNo}`);
      return regNo;
    } catch (error) {
      console.error("Failed to generate index number:", error);
      throw error;
    }
  }
}

export default UserService;
