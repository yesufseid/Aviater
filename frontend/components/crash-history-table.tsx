import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CrashData {
  id: string
  value: string
  timestamp: any
}

interface CrashHistoryTableProps {
  data: CrashData[]
}

export default function CrashHistoryTable({ data }: CrashHistoryTableProps) {
  return (
    <div className="max-h-[300px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Crash Value</TableHead>
            <TableHead className="text-right">Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => {
            const value = Number(item)
            const isLow = value < 2.0

            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className={`font-mono font-bold ${isLow ? "text-red-500" : "text-emerald-500"}`}>
                  {value.toFixed(2)}x
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`inline-flex rounded px-2 py-1 text-xs font-medium ${
                      isLow ? "bg-red-950/30 text-red-500" : "bg-emerald-950/30 text-emerald-500"
                    }`}
                  >
                    {isLow ? "🟥 < 2.0" : "🟩 ≥ 2.0"}
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
