import { UserDataInAdminType } from "@/types";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { setExamResults } from "@/firebase/api";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { toSquareLettersAndNumbers } from "@/lib/utils";

type OutletContextType = {
  usersData: UserDataInAdminType[] | null;
};

// const toFullWidth = (text: string) => {
//   return text
//     .split("")
//     .map((char) => {
//       const code = char.charCodeAt(0);
//       // Convert A-Z, a-z, and 0-9 to full-width
//       if (code >= 33 && code <= 126) {
//         return String.fromCharCode(code + 65248);
//       }
//       return char; // Return other characters (e.g., spaces) as is
//     })
//     .join("");
// };

const AddResultsPage = () => {
  const { examIdName } = useParams();
  const { usersData } = useOutletContext<OutletContextType>();
  const [marks, setMarks] = useState<Record<string, number>>({});

  const navigate = useNavigate();

  const examId = examIdName?.split("-")[0];
  const examName = examIdName?.split("-")[1];

  useEffect(() => {
    if (!examId || !usersData) return;

    // Subscribe to changes for each user's exam record in real time
    const unsubscribes = usersData.map(({ uid }) => {
      const userExamDocRef = doc(db, `users/${uid}/exams`, examId);

      // Listen for changes in each user's exam document
      return onSnapshot(userExamDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setMarks((prevMarks) => ({
            ...prevMarks,
            [uid]: data.examResult || 0,
          }));
        }
      });
    });

    // Cleanup on unmount
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [examId, usersData]);

  const handleMarkChange = (uid: string, value: string) => {
    setMarks((prev) => ({
      ...prev,
      [uid]: parseFloat(value),
    }));
  };

  const handleSubmitMarks = async () => {
    if (!examId || !examName) return;
    await setExamResults(examId, marks);
    navigate("/admin/exams");
  };

  return (
    <div className="p-2 md:p-5 flex flex-col gap-3 items-center justify-center">
      {/* <h1>
        {toFullWidth(examName)} &nbsp;
        &#65330;&#65349;&#65363;&#65365;&#65356;&#65364;
      </h1> */}

      <h1 className="text-[#00A6ED]">
        {toSquareLettersAndNumbers(`${examName} RESULTS`)}
      </h1>
      <Card className="p-3">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">RegNo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Marks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData &&
                usersData.map(({ regNo, userName, uid }, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{regNo}</TableCell>
                    <TableCell>{userName}</TableCell>
                    <TableCell>
                      <Input
                        value={marks[uid] || ""}
                        onChange={(e) => handleMarkChange(uid, e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>

        <Button onClick={handleSubmitMarks}>Submit</Button>
      </Card>
    </div>
  );
};

export default AddResultsPage;
