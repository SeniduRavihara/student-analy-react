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
import { Switch } from "@/components/ui/switch";

type OutletContextType = {
  usersData: UserDataInAdminType[] | null;
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
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [absentStatus, setAbsentStatus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

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
            [uid]: data.examResult || 0,
          }));
          setAbsentStatus((prevStatus) => ({
            ...prevStatus,
            [uid]: data.isAbsent || false,
          }));
        }
      });
    });

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [examId, usersData]);

  const handleMarkChange = (uid: string, value: string) => {
    setMarks((prev) => ({
      ...prev,
      [uid]: parseFloat(value),
    }));
  };

  const handleAbsentToggle = (uid: string) => {
    setAbsentStatus((prev) => {
      const isAbsent = !prev[uid];
      return {
        ...prev,
        [uid]: isAbsent,
      };
    });

    setMarks((prev) => ({
      ...prev,
      [uid]: 0, // Reset marks to 0 if absent
    }));
  };

  const handleSubmitMarks = async () => {
    if (!examId || !examName) return;
    const results = Object.keys(marks).reduce((acc, uid) => {
      acc[uid] = {
        examResult: absentStatus[uid] ? 0 : marks[uid], // Mark 0 if absent
        isAbsent: absentStatus[uid],
      };
      return acc;
    }, {} as Record<string, { examResult: number; isAbsent: boolean }>);
    // console.log(results);
    
    await setExamResults(examId, results);
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
                        checked={absentStatus[uid] || false}
                        onCheckedChange={() => handleAbsentToggle(uid)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={marks[uid] || ""}
                        onChange={(e) => handleMarkChange(uid, e.target.value)}
                        disabled={absentStatus[uid] || false} // Disable if marked absent
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
