import type { ColumnDef } from "@tanstack/react-table";
import { MtgExpansionIcon } from "./mtg-expansion-icon.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import type { MtgExpansion } from "../../types/mtg-types.ts";
import { formatCurrency, formatTwoDecimal } from "../../lib/utils.ts";

export const columns: ColumnDef<MtgExpansion>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-left">Name</div>,
    cell: ({ row }) => {
      const data = row.original;
      const icon = data.iconUri;
      const name = data.name;
      const type = data.setType;

      return (
        <div className="flex flex-row gap-x-5">
          <MtgExpansionIcon image={icon} name={name} />
          <h3 className="my-auto">{name}</h3>
          <Badge variant="outline">{type}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "percentCollected",
    header: () => <div className="text-left">Percent Collected</div>,
    cell: ({ row }) => {
      const data = row.original;
      const percentCollected = (data.ownedCards / data.totalCards) * 100;
      return <div>{formatTwoDecimal(percentCollected)} %</div>;
    },
  },
  {
    accessorKey: "setValue",
    header: () => <div className="text-left">Set value</div>,
    cell: ({ row }) => {
      const data = row.original;
      return <div>{formatCurrency(data.totalPrice)}</div>;
    },
  },
  {
    accessorKey: "collectedValue",
    header: () => <div className="text-left">Collected value</div>,
    cell: ({ row }) => {
      const data = row.original;
      return <div>{formatCurrency(data.ownedPrice)}</div>;
    },
  },
  {
    accessorKey: "code",
    header: () => <div className="text-left">Code</div>,
    cell: ({ row }) => {
      const data = row.original;
      return <div className="uppercase">{data.code}</div>;
    },
  },
  {
    accessorKey: "releaseDate",
    header: () => <div className="text-left">Release date</div>,
    cell: ({ row }) => {
      const data = row.original;
      return <div>{data.releaseDate.toString()}</div>;
    },
  },
];
