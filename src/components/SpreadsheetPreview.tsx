import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

type SpreadsheetRow = Record<string, string | number>;

type SpreadsheetData = {
  headers: string[];
  data: SpreadsheetRow[];
  formulas: string[];
};

type ColumnType = {
  [K in string]: string | number;
};

export default function SpreadsheetPreview({ data }: { data: SpreadsheetData | null }) {
  const [columns, setColumns] = useState<ColumnDef<ColumnType, string | number>[]>([]);

  useEffect(() => {
    if (data?.headers) {
      const tableColumns: ColumnDef<ColumnType, string | number>[] = data.headers.map((header) => ({
        accessorKey: header.toLowerCase().replace(/\s+/g, '_'),
        header: header,
        cell: (info) => info.getValue(),
      }));
      setColumns(tableColumns);
    }
  }, [data]);

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 