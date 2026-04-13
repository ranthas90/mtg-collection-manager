import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CardSet } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SetsPanelProps {
  sets: CardSet[];
  selectedSet: CardSet | null;
  onSetSelect: (set: CardSet) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SetsPanel({
  sets,
  selectedSet,
  onSetSelect,
  searchQuery,
  onSearchChange,
}: SetsPanelProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProgressPercentage = (collected: number, total: number) => {
    return Math.round((collected / total) * 100);
  };

  const filteredSets = sets.filter((set) =>
    set.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex w-80 flex-col border-r border-border bg-card">
      {/* Panel Header */}
      <div className="flex h-8 items-center border-b border-border bg-secondary px-3">
        <span className="text-xs font-medium text-foreground">Sets</span>
        <span className="ml-auto text-[10px] text-muted-foreground">
          {filteredSets.length} of {sets.length}
        </span>
      </div>

      {/* Search Filter */}
      <div className="border-b border-border bg-card p-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search sets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-7 pl-7 text-xs"
          />
        </div>
      </div>

      {/* Sets Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="h-7 text-[11px] font-medium text-muted-foreground">
                Name
              </TableHead>
              <TableHead className="h-7 text-[11px] font-medium text-muted-foreground">
                Type
              </TableHead>
              <TableHead className="h-7 text-[11px] font-medium text-muted-foreground w-24">
                Progress
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSets.map((set) => (
              <TableRow
                key={set.id}
                onClick={() => onSetSelect(set)}
                className={cn(
                  "cursor-pointer border-border",
                  selectedSet?.id === set.id
                    ? "bg-primary/10 hover:bg-primary/15"
                    : "hover:bg-secondary",
                )}
              >
                <TableCell className="py-1.5">
                  <div className="flex items-center gap-2">
                    {set.iconUri && (
                      <img
                        src={set.iconUri}
                        alt=""
                        className="size-5 shrink-0"
                        style={{ filter: "brightness(0) saturate(100%)" }}
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-foreground truncate max-w-[100px]">
                        {set.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(set.releaseDate)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-1.5">
                  <span className="text-[10px] text-muted-foreground">
                    {set.type}
                  </span>
                </TableCell>
                <TableCell className="py-1.5">
                  <div className="flex flex-col gap-1">
                    <Progress
                      value={getProgressPercentage(
                        set.collectedCards,
                        set.totalCards,
                      )}
                      className="h-1.5"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {set.collectedCards}/{set.totalCards}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredSets.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-8 text-center text-xs text-muted-foreground"
                >
                  No sets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
