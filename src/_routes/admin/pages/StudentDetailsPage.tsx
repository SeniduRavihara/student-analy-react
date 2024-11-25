import { columns } from "@/_routes/admin/components/student-data/Coloumns";
import { UserDataType } from "@/types";
import { DataTable } from "../components/student-data/DataTable";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

type OutletContextType = {
  usersData: UserDataType[] | null;
};

const StudentDetailsPage = () => {
  const { usersData } = useOutletContext<OutletContextType>();

  // console.log("users", usersData);

  return (
    <div className="p-2 md:p-5 w-full h-full overflow-auto">
      <Card>
        <CardContent>
          {usersData && (
            <DataTable
              columns={columns}
              data={usersData?.map((user) => ({
                indexNo: user.regNo || "",
                name: user.userName,
                email: user.email,
                lastResult: user.lastResult || 0,
              }))}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default StudentDetailsPage;
