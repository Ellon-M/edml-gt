import React from 'react';

const Table: React.FC<{ columns: string[]; children: React.ReactNode }> = ({ columns, children }) => {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full table-fixed">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c} className="text-left px-4 py-3 text-sm text-gray-600">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
