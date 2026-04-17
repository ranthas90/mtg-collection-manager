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
import { Spinner } from "@/components/ui/spinner";
import { ManaCost } from "@/components/mana-cost";
import type { Card, CardSet } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Layers, Search } from "lucide-react";

interface SetDetailPanelProps {
  selectedSet: CardSet | null;
  cards: Card[];
  cardsLoading: boolean;
  cardsError: string;
  onCardCollectedChange: (cardId: string, collected: boolean) => void;
  updatingCardIds: Set<string>;
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
  cards = [],
  cardsLoading,
  cardsError,
  onCardCollectedChange,
  updatingCardIds,
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
      case "mythic":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "rare":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "uncommon":
        return "bg-slate-200 text-slate-700 border-slate-300";
      case "common":
        return "bg-gray-100 text-gray-600 border-gray-300";
      default:
        return "";
    }
  };

  const getRegularPrice = (card: Card) => card.regularPrice ?? card.price ?? null;

  const getFoilPrice = (card: Card) => card.foilPrice ?? null;

  const formatPrice = (price: number | null) =>
    price === null ? "N/A" : `€${price.toFixed(2)}`;

  const getDisplayValue = (card: Card) => getRegularPrice(card) ?? getFoilPrice(card) ?? 0;

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

  const totalValue = cards.reduce((sum, card) => sum + getDisplayValue(card), 0);
  const collectedValue = cards
    .filter((c) => c.collected)
    .reduce((sum, card) => sum + getDisplayValue(card), 0);

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
              <SelectItem value="common" className="text-xs">
                Common
              </SelectItem>
              <SelectItem value="uncommon" className="text-xs">
                Uncommon
              </SelectItem>
              <SelectItem value="rare" className="text-xs">
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
        {cardsLoading ? (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3">
            <Spinner className="size-6" />
            <p className="text-xs text-muted-foreground">Loading set cards...</p>
          </div>
        ) : cardsError ? (
          <div className="flex h-full min-h-[240px] items-center justify-center px-6">
            <p className="text-center text-xs text-destructive">{cardsError}</p>
          </div>
        ) : (
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
                  Regular Price
                </TableHead>
                <TableHead className="h-8 text-[11px] font-medium text-muted-foreground text-right">
                  Foil Price
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
                    {card.collectionNumber.padStart(3, "0")}
                  </TableCell>
                  <TableCell className="py-1.5">
                    {card.imageUriArtCrop ? (
                      <div className="flex h-10 w-16 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-muted/40 shadow-sm">
                        <img
                          src={card.imageUriArtCrop}
                          alt=""
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-16 items-center justify-center rounded-md bg-muted">
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
                  <ManaCost
                    manaCost={card.manaCost}
                    className="text-xs text-muted-foreground"
                    iconClassName="size-4"
                  />
                </TableCell>
                  <TableCell className="py-1.5 text-right">
                    <span className="text-xs font-medium text-foreground">
                      {formatPrice(getRegularPrice(card))}
                    </span>
                  </TableCell>
                  <TableCell className="py-1.5 text-right">
                    <span className="text-xs font-medium text-foreground">
                      {formatPrice(getFoilPrice(card))}
                    </span>
                  </TableCell>
                  <TableCell className="py-1.5 text-center">
                    <Checkbox
                      checked={card.collected}
                      disabled={updatingCardIds.has(card.id)}
                      onCheckedChange={(checked) => {
                        void onCardCollectedChange(card.id, checked as boolean);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {filteredCards.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-8 text-center text-xs text-muted-foreground"
                  >
                    No cards match the current filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
