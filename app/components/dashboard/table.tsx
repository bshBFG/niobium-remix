import { createContext, ReactNode, useContext } from "react";

type TableProps = {
  children: ReactNode;
};

type TableHeadProps = {
  children: ReactNode;
};

type TableBodyProps = {
  children: ReactNode;
};

type TableRowProps = {
  children: ReactNode;
};

type TableCellProps = {
  children: ReactNode;
  as?: "th" | "td";
};

export const Table = ({ children }: TableProps) => (
  <table className="min-w-full">{children}</table>
);

export const TableHead = ({ children }: TableHeadProps) => (
  <TableLvlContext.Provider value={{ parent: "head" }}>
    <thead className="divide-slate-200 border-y bg-slate-50">{children}</thead>
  </TableLvlContext.Provider>
);

export const TableBody = ({ children }: TableBodyProps) => (
  <TableLvlContext.Provider value={{ parent: "body" }}>
    <tbody className="divide-y divide-slate-200 bg-white">{children}</tbody>
  </TableLvlContext.Provider>
);

export const TableRow = ({ children }: TableRowProps) => {
  const context = useContext(TableLvlContext);

  if (context?.parent === "head") {
    return <tr>{children}</tr>;
  }

  return <tr className="hover:bg-slate-50">{children}</tr>;
};

export const TableCell = ({ children, as = "td" }: TableCellProps) => {
  const context = useContext(TableLvlContext);

  if (context?.parent === "head") {
    return (
      <th className="relative px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
        {children}
      </th>
    );
  }

  return (
    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
      {children}
    </td>
  );
};

type TableLvlContextStore = {
  parent: "head" | "body" | "footer";
};

const TableLvlContext = createContext<TableLvlContextStore | null>(null);
