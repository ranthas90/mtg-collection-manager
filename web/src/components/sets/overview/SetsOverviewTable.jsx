import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/components/table/Table";
import { formatEuroCurrency } from "../../../shared/lib/utils";

const SetsOverviewTable = ({ sets }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Set icon</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Release date</TableHead>
          <TableHead>Set type</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Collection price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sets &&
          sets.map((set) => (
            <TableRow key={set.code}>
              <TableCell className="hidden sm:table-cell">
                <img
                  alt="Set icon image"
                  className="aspect-square rounded-md object-fit"
                  height={32}
                  width={32}
                  src={set.iconPath}
                />
              </TableCell>
              <TableCell className="font-semibold underline">
                <Link to={`/sets/${set.id}`}>{set.name}</Link>
              </TableCell>
              <TableCell className="hidden md:table-cell font-medium">
                {set.releasedAt}
              </TableCell>
              <TableCell>{set.setType}</TableCell>
              <TableCell className="font-medium">
                {set.ownedCards} / {set.totalCards}
              </TableCell>
              <TableCell className="font-medium">
                {formatEuroCurrency(1234111.345)}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default SetsOverviewTable;
