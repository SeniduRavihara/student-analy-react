import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { setExamResults } from "@/firebase/api";
import { db } from "@/firebase/config";
import { UserDataInAdminType } from "@/types";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

type OutletContextType = {
  usersData: UserDataInAdminType[] | null;
  selectedClass: string;
};

const toFullWidth = (text: string) => {
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 33 && code <= 126) {
        return String.fromCharCode(code + 65248);
      }
      return char;
    })
    .join("");
};

const AddResultsPage = () => {
  const { examIdName } = useParams();
  const { usersData } = useOutletContext<OutletContextType>();
  const [marks, setMarks] = useState<
    Record<string, { examResult: number| null; isAbsent: boolean }>
  >({});
  // const [absentStatus, setAbsentStatus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const examId = examIdName?.split("-")[0];
  const examName = examIdName?.split("-")[1];

  useEffect(() => {
    if (!examId || !usersData) return;

    const unsubscribes = usersData.map(({ uid }) => {
      const userExamDocRef = doc(db, `users/${uid}/exams`, examId);

      return onSnapshot(userExamDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setMarks((prevMarks) => ({
            ...prevMarks,
            [uid]: {
              examResult: data.examResult || null,
              isAbsent: data.isAbsent || false,
            },
          }));
          // setAbsentStatus((prevStatus) => ({
          //   ...prevStatus,
          //   [uid]: data.isAbsent || false,
          // }));
        }
      });
    });

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [examId, usersData]);

  const handleMarkChange = (uid: string, value: string) => {
    setMarks((prev) => ({
      ...prev,
      [uid]: { examResult: parseFloat(value)|| null, isAbsent: false },
    }));
  };

  const handleAbsentToggle = (uid: string) => {
    // setAbsentStatus((prev) => {
    //   const isAbsent = !prev[uid];
    //   return {
    //     ...prev,
    //     [uid]: isAbsent,
    //   };
    // });

    // setMarks((prev) => ({
    //   ...prev,
    //   [uid]: null, // Reset marks to 0 if absent
    // }));

    setMarks((prev)=>{
      const isAbsent = ! prev[uid].isAbsent
      return {
        ...prev,
        [uid]: {examResult: null , isAbsent}
      }
    })
  };

  const handleSubmitMarks = async () => {
    setIsLoading(true);
    if (!examId || !examName) return;
    // const results = Object.keys(marks).reduce((acc, uid) => {
    //   acc[uid] = {
    //     examResult: absentStatus[uid] ? null : marks[uid], // Mark 0 if absent
    //     isAbsent: absentStatus[uid],
    //   };
    //   return acc;
    // }, {} as Record<string, { examResult: number; isAbsent: boolean }>);
    console.log(marks);

    await setExamResults(examId, marks);
    setIsLoading(false);
    navigate("/admin/exams");
  };

  return (
    <div className="p-2 md:p-5 flex flex-col gap-3 items-center justify-center">
      <h1>{toFullWidth(examName ?? "")}</h1>

      <Card className="p-3">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">RegNo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Absent</TableHead>
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
                      <Switch
                        checked={marks && marks[uid]?.isAbsent || false}
                        onCheckedChange={() => handleAbsentToggle(uid)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={marks && marks[uid]?.examResult || ""}
                        onChange={(e) => handleMarkChange(uid, e.target.value)}
                        disabled={marks && marks[uid]?.isAbsent || false} // Disable if marked absent
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>

        <Button onClick={handleSubmitMarks} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </Card>
    </div>
  );
};

export default AddResultsPage;
