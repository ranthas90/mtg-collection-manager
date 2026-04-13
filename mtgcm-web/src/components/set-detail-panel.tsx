import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Card, CardSet } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Layers, Search } from "lucide-react";

interface SetDetailPanelProps {
  selectedSet: CardSet | null;
  cards: Card[];
  onCardCollectedChange: (cardId: string, collected: boolean) => void;
  cardNameFilter: string;
  onCardNameFilterChange: (value: string) => void;
  rarityFilter: string;
  onRarityFilterChange: (value: string) => void;
  ownedFilter: string;
  onOwnedFilterChange: (value: string) => void;
  onCardClick: (card: Card) => void;
}

export function SetDetailPanel({
  selectedSet,
  cards,
  onCardCollectedChange,
  cardNameFilter,
  onCardNameFilterChange,
  rarityFilter,
  onRarityFilterChange,
  ownedFilter,
  onOwnedFilterChange,
  onCardClick,
}: SetDetailPanelProps) {
  if (!selectedSet) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Layers className="size-12 opacity-30" />
          <span className="text-sm">Select a set to view cards</span>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProgressPercentage = (collected: number, total: number) => {
    return Math.round((collected / total) * 100);
  };

  const getRarityColor = (rarity: Card["rarity"]) => {
    switch (rarity) {
      case "Mythic Rare":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "Rare":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "Uncommon":
        return "bg-slate-200 text-slate-700 border-slate-300";
      case "Common":
        return "bg-gray-100 text-gray-600 border-gray-300";
      default:
        return "";
    }
  };

  // Filter cards
  const filteredCards = cards.filter((card) => {
    const matchesName = card.name
      .toLowerCase()
      .includes(cardNameFilter.toLowerCase());
    const matchesRarity =
      rarityFilter === "all" || card.rarity === rarityFilter;
    const matchesOwned =
      ownedFilter === "all" ||
      (ownedFilter === "owned" && card.collected) ||
      (ownedFilter === "missing" && !card.collected);
    return matchesName && matchesRarity && matchesOwned;
  });

  const totalValue = cards.reduce((sum, card) => sum + card.price, 0);
  const collectedValue = cards
    .filter((c) => c.collected)
    .reduce((sum, card) => sum + card.price, 0);

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Set Info Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {selectedSet.iconUri && (
              <img
                src={selectedSet.iconUri}
                alt=""
                className="size-8"
                style={{ filter: "brightness(0) saturate(100%)" }}
              />
            )}
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-foreground">
                {selectedSet.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{selectedSet.type}</span>
                <span className="text-border">|</span>
                <span>Released {formatDate(selectedSet.releaseDate)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Progress:</span>
              <span className="text-sm font-medium text-primary">
                {getProgressPercentage(
                  selectedSet.collectedCards,
                  selectedSet.totalCards,
                )}
                %
              </span>
            </div>
            <Progress
              value={getProgressPercentage(
                selectedSet.collectedCards,
                selectedSet.totalCards,
              )}
              className="h-2 w-32"
            />
            <span className="text-[10px] text-muted-foreground">
              {selectedSet.collectedCards} of {selectedSet.totalCards} cards
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-4 flex gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total Value
            </span>
            <span className="text-sm font-medium text-foreground">
              ${totalValue.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Collected Value
            </span>
            <span className="text-sm font-medium text-primary">
              ${collectedValue.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Cards Shown
            </span>
            <span className="text-sm font-medium text-foreground">
              {filteredCards.length} / {cards.length}
            </span>
          </div>
        </div>
      </div>

      {/* Cards Table Header with Filters */}
      <div className="flex items-center gap-3 border-b border-border bg-secondary px-3 py-2">
        <span className="text-xs font-medium text-foreground">Cards</span>
        <div className="ml-auto flex items-center gap-2">
          {/* Name Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search cards..."
              value={cardNameFilter}
              onChange={(e) => onCardNameFilterChange(e.target.value)}
              className="h-6 w-40 pl-7 text-[11px]"
            />
          </div>

          {/* Rarity Filter */}
          <Select value={rarityFilter} onValueChange={onRarityFilterChange}>
            <SelectTrigger className="h-6 w-28 text-[11px]" size="sm">
              <SelectValue placeholder="Rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All Rarities
              </SelectItem>
              <SelectItem value="Common" className="text-xs">
                Common
              </SelectItem>
              <SelectItem value="Uncommon" className="text-xs">
                Uncommon
              </SelectItem>
              <SelectItem value="Rare" className="text-xs">
                Rare
              </SelectItem>
              <SelectItem value="Mythic Rare" className="text-xs">
                Mythic Rare
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Owned Filter */}
          <Select value={ownedFilter} onValueChange={onOwnedFilterChange}>
            <SelectTrigger className="h-6 w-24 text-[11px]" size="sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All Cards
              </SelectItem>
              <SelectItem value="owned" className="text-xs">
                Owned
              </SelectItem>
              <SelectItem value="missing" className="text-xs">
                Missing
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="h-8 w-10 text-[11px] font-medium text-muted-foreground">
                #
              </TableHead>
              <TableHead className="h-8 w-14 text-[11px] font-medium text-muted-foreground">
                Image
              </TableHead>
              <TableHead className="h-8 text-[11px] font-medium text-muted-foreground">
                Name
              </TableHead>
              <TableHead className="h-8 text-[11px] font-medium text-muted-foreground">
                Type
              </TableHead>
              <TableHead className="h-8 text-[11px] font-medium text-muted-foreground">
                Rarity
              </TableHead>
              <TableHead className="h-8 text-[11px] font-medium text-muted-foreground">
                Mana
              </TableHead>
              <TableHead className="h-8 text-[11px] font-medium text-muted-foreground text-right">
                Price
              </TableHead>
              <TableHead className="h-8 w-16 text-[11px] font-medium text-muted-foreground text-center">
                Owned
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCards.map((card) => (
              <TableRow
                key={card.id}
                onClick={() => onCardClick(card)}
                className={cn(
                  "border-border cursor-pointer",
                  card.collected
                    ? "bg-primary/5 hover:bg-primary/10"
                    : "hover:bg-secondary",
                )}
              >
                <TableCell className="py-1.5 text-xs text-muted-foreground font-mono">
                  {String(card.sortNumber).padStart(3, "0")}
                </TableCell>
                <TableCell className="py-1.5">
                  {card.imageUri ? (
                    <img
                      src={card.imageUri}
                      alt=""
                      className="w-10 h-14 object-cover rounded shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-14 bg-muted rounded flex items-center justify-center">
                      <span className="text-[8px] text-muted-foreground">
                        N/A
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-1.5">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      card.collected
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {card.name}
                  </span>
                </TableCell>
                <TableCell className="py-1.5">
                  <span className="text-xs text-muted-foreground">
                    {card.type}
                  </span>
                </TableCell>
                <TableCell className="py-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0",
                      getRarityColor(card.rarity),
                    )}
                  >
                    {card.rarity}
                  </Badge>
                </TableCell>
                <TableCell className="py-1.5">
                  <span className="text-xs font-mono text-muted-foreground">
                    {card.manaCost || "—"}
                  </span>
                </TableCell>
                <TableCell className="py-1.5 text-right">
                  <span className="text-xs font-medium text-foreground">
                    ${card.price.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="py-1.5 text-center">
                  <Checkbox
                    checked={card.collected}
                    onCheckedChange={(checked) => {
                      onCardCollectedChange(card.id, checked as boolean);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filteredCards.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-xs text-muted-foreground"
                >
                  No cards match the current filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
