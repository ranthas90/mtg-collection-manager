import type { ColumnDef } from "@tanstack/react-table";
import { MtgExpansionIcon } from "./mtg-expansion-icon.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import type { MtgExpansion } from "../../types/mtg-types.ts";
import { formatCurrency, formatTwoDecimal } from "../../lib/utils.ts";

export const columns: ColumnDef<MtgExpansion>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-right">Name</div>,
    cell: ({ row }) => {
      const data = row.original;
      const icon = data.iconUri;
      const name = data.name;
      const type = data.setType;

      return (
        <div>
          <MtgExpansionIcon image={icon} name={name} /> - {name} - {type} -{" "}
          <Badge variant="outline">{type}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "percentCollected",
    header: () => <div className="text-right">Percent Collected</div>,
    cell: ({ row }) => {
      const data = row.original;
      const percentCollected = (data.ownedCards / data.totalCards) * 100;
      return <div>{formatTwoDecimal(percentCollected)} %</div>;
    },
  },
  {
    accessorKey: "setValue",
    header: () => <div className="text-right">Set value</div>,
    cell: ({ row }) => {
      const data = row.original;
      return <div>{formatCurrency(data.totalPrice)}</div>;
    },
  },
  {
    accessorKey: "collectedValue",
    header: () => <div className="text-right">Set value</div>,
    cell: ({ row }) => {
      const data = row.original;
      return <div>{formatCurrency(data.totalPrice)}</div>;
    },
  },
  {
    accessorKey: "code",
    header: () => <div className="text-right">Set value</div>,
    cell: ({ row }) => {
      const data = row.original;
      return <div>{formatCurrency(data.totalPrice)}</div>;
    },
  },
  {
    accessorKey: "releaseDate",
    header: () => <div className="text-right">Set value</div>,
    cell: ({ row }) => {
      const data = row.original;
      return <div>{formatCurrency(data.totalPrice)}</div>;
    },
  },
];
