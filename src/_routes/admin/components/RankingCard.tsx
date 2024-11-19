import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RankingDataType {
  rank: number;
  marks: number | null;
  name: string;
  regNo: string;
}

const RankingCard = ({
  usersMarksData,
}: {
  usersMarksData: Array<RankingDataType>;
}) => {
  return (
    <Card className="w-full h-auto">
      <CardHeader>
        <CardTitle>Student Rankings</CardTitle>
      </CardHeader>
      <CardContent>
        {usersMarksData && usersMarksData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200 text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="border border-gray-200 px-3 py-2">
                    Rank
                  </th>
                  <th scope="col" className="border border-gray-200 px-3 py-2">
                    Name
                  </th>
                  <th scope="col" className="border border-gray-200 px-3 py-2">
                    Reg. No
                  </th>
                  <th scope="col" className="border border-gray-200 px-3 py-2">
                    Marks
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersMarksData.map((student, index) => (
                  <tr
                    key={student.regNo}
                    className={`hover:bg-gray-50 ${
                      index === 0 ? "bg-yellow-100 font-semibold" : ""
                    }`}
                  >
                    <td className="border border-gray-200 px-3 py-2">
                      {student.rank}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {student.name}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {student.regNo}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {student.marks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No ranking data available.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RankingCard;
