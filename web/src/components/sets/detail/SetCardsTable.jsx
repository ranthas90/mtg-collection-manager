import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/components/table/Table";
import ManaCost from "../../mana-cost/ManaCost";
import { formatEuroCurrency, capitalize } from "../../../shared/lib/utils";
import { Button } from "../../../shared/components/button/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../shared/components/dropdown-menu/DropdownMenu";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const SetCardsTable = ({ cards }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Rarity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Foil price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Foil quantity</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cards &&
          cards.map((card) => (
            <TableRow key={card.id}>
              <TableCell>{card.collectorNumber}</TableCell>
              <TableCell>
                <div className="flex flex-row gap-x-4">
                  <img
                    alt="Card image"
                    className="aspect-square rounded-md object-fit"
                    height={64}
                    width={64}
                    src={card.image}
                  />
                  <div className="flex flex-col gap-y-1">
                    <Link
                      to={card.scryfallUri}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="font-semibold underline">{card.name}</div>
                    </Link>
                    <ManaCost manaCost={card.manaCost} />
                  </div>
                </div>
              </TableCell>
              <TableCell>{card.type}</TableCell>
              <TableCell>{capitalize(card.rarity)}</TableCell>
              <TableCell>{formatEuroCurrency(card.price.nonFoil)}</TableCell>
              <TableCell>{formatEuroCurrency(card.price.foil)}</TableCell>
              <TableCell>{card.quantity.nonFoil}</TableCell>
              <TableCell>{card.quantity.foil}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Non foil</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => alert("123123")}>
                      Set to 1
                    </DropdownMenuItem>
                    <DropdownMenuItem>Set to 2</DropdownMenuItem>
                    <DropdownMenuItem>Set to 3</DropdownMenuItem>
                    <DropdownMenuItem>Set to 4</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Foil</DropdownMenuLabel>
                    <DropdownMenuItem>Set to 1</DropdownMenuItem>
                    <DropdownMenuItem>Set to 2</DropdownMenuItem>
                    <DropdownMenuItem>Set to 3</DropdownMenuItem>
                    <DropdownMenuItem>Set to 4</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default SetCardsTable;
