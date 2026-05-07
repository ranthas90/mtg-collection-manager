import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchSetCards } from "@/lib/api";
import type { Card, CardSet } from "@/lib/data";
import { cn } from "@/lib/utils";

interface CollectionDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sets: CardSet[];
}

type RarityValue = Record<Card["rarity"], number>;

const rarityOrder: Card["rarity"][] = ["mythic", "rare", "uncommon", "common"];

function getRegularPrice(card: Card) {
  return card.regularPrice ?? card.price ?? null;
}

function getFoilPrice(card: Card) {
  return card.foilPrice ?? null;
}

function getCardValue(card: Card) {
  return getRegularPrice(card) ?? getFoilPrice(card) ?? 0;
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

function getRarityColor(rarity: Card["rarity"]) {
  switch (rarity) {
    case "mythic":
      return "border-orange-300 bg-orange-100 text-orange-700";
    case "rare":
      return "border-amber-300 bg-amber-100 text-amber-700";
    case "uncommon":
      return "border-slate-300 bg-slate-200 text-slate-700";
    case "common":
      return "border-gray-300 bg-gray-100 text-gray-600";
    default:
      return "";
  }
}

export function CollectionDashboardDialog({
  open,
  onOpenChange,
  sets,
}: CollectionDashboardDialogProps) {
  const setIds = useMemo(() => sets.map((set) => set.id), [sets]);

  const {
    data: cardsBySet,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["collection-dashboard", setIds],
    queryFn: async () => {
      const entries = await Promise.all(
        sets.map(async (set) => [set.id, await fetchSetCards(set.id)] as const),
      );

      return Object.fromEntries(entries) as Record<string, Card[]>;
    },
    enabled: open && sets.length > 0,
    staleTime: 30_000,
  });

  const stats = useMemo(() => {
    const allCards = Object.values(cardsBySet ?? {}).flat();
    const collectedCards = allCards.filter((card) => card.collected);
    const totalCards = sets.reduce((sum, set) => sum + set.totalCards, 0);
    const collectedCount = sets.reduce(
      (sum, set) => sum + set.collectedCards,
      0,
    );
    const totalValue = collectedCards.reduce(
      (sum, card) => sum + getCardValue(card),
      0,
    );
    const valueByRarity = collectedCards.reduce<RarityValue>(
      (values, card) => {
        values[card.rarity] += getCardValue(card);
        return values;
      },
      {
        common: 0,
        uncommon: 0,
        rare: 0,
        mythic: 0,
      },
    );
    const mostValuableCards = [...collectedCards]
      .sort((a, b) => getCardValue(b) - getCardValue(a))
      .slice(0, 10);
    const completionPercentage =
      totalCards === 0 ? 0 : Math.round((collectedCount / totalCards) * 100);

    return {
      collectedCount,
      totalCards,
      totalValue,
      valueByRarity,
      mostValuableCards,
      completionPercentage,
    };
  }, [cardsBySet, sets]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] flex-col overflow-hidden p-4 sm:w-[calc(100vw-4rem)] sm:max-w-[1040px]">
        <DialogHeader>
          <DialogTitle>Collection Dashboard</DialogTitle>
          <DialogDescription>
            Summary stats across all loaded collection sets.
          </DialogDescription>
        </DialogHeader>

        {sets.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center text-sm text-muted-foreground">
            No sets loaded.
          </div>
        ) : isFetching && !cardsBySet ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
            <Spinner className="size-7" />
            <p className="text-sm text-muted-foreground">
              Loading cards across {sets.length} sets...
            </p>
          </div>
        ) : isError ? (
          <div className="flex min-h-[300px] items-center justify-center px-6">
            <p className="text-center text-sm text-destructive">
              {error instanceof Error
                ? error.message
                : "Failed to load collection dashboard."}
            </p>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-md border border-border bg-card p-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Cards Owned
                </span>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {stats.collectedCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  of {stats.totalCards} cards
                </p>
              </div>
              <div className="rounded-md border border-border bg-card p-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Collection Value
                </span>
                <p className="mt-1 text-xl font-semibold text-primary">
                  {formatCurrency(stats.totalValue)}
                </p>
                <p className="text-xs text-muted-foreground">
                  owned cards only
                </p>
              </div>
              <div className="rounded-md border border-border bg-card p-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Completion
                </span>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {stats.completionPercentage}%
                </p>
                <Progress
                  className="mt-2 h-1.5"
                  value={stats.completionPercentage}
                />
              </div>
              <div className="rounded-md border border-border bg-card p-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Sets Tracked
                </span>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {sets.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  included in dashboard
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    Most Valuable Cards
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Top {stats.mostValuableCards.length}
                  </span>
                </div>
                <div className="overflow-x-auto rounded-md border border-border">
                  <Table className="min-w-[720px]">
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="h-8 text-[11px]">Card</TableHead>
                        <TableHead className="h-8 text-[11px]">Set</TableHead>
                        <TableHead className="h-8 text-[11px]">Rarity</TableHead>
                        <TableHead className="h-8 text-right text-[11px]">
                          Regular
                        </TableHead>
                        <TableHead className="h-8 text-right text-[11px]">
                          Foil
                        </TableHead>
                        <TableHead className="h-8 text-right text-[11px]">
                          Value
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.mostValuableCards.map((card) => (
                        <TableRow key={card.id}>
                          <TableCell className="py-2">
                            <span className="text-xs font-medium text-foreground">
                              {card.name}
                            </span>
                            <span className="ml-2 text-[10px] text-muted-foreground">
                              #{card.collectionNumber.padStart(3, "0")}
                            </span>
                          </TableCell>
                          <TableCell className="py-2 text-xs text-muted-foreground">
                            {card.setName ?? card.setCode?.toUpperCase() ?? "-"}
                          </TableCell>
                          <TableCell className="py-2">
                            <Badge
                              className={cn("px-1.5 py-0 text-[10px]", getRarityColor(card.rarity))}
                              variant="outline"
                            >
                              {card.rarity}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2 text-right text-xs">
                            {getRegularPrice(card) === null
                              ? "N/A"
                              : formatCurrency(getRegularPrice(card) ?? 0)}
                          </TableCell>
                          <TableCell className="py-2 text-right text-xs">
                            {getFoilPrice(card) === null
                              ? "N/A"
                              : formatCurrency(getFoilPrice(card) ?? 0)}
                          </TableCell>
                          <TableCell className="py-2 text-right text-xs font-medium text-primary">
                            {formatCurrency(getCardValue(card))}
                          </TableCell>
                        </TableRow>
                      ))}
                      {stats.mostValuableCards.length === 0 && (
                        <TableRow>
                          <TableCell
                            className="py-8 text-center text-xs text-muted-foreground"
                            colSpan={6}
                          >
                            No owned cards with value found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    Value by Rarity
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Owned cards
                  </span>
                </div>
                <div className="space-y-2 rounded-md border border-border bg-card p-3">
                  {rarityOrder.map((rarity) => {
                    const value = stats.valueByRarity[rarity];
                    const percentage =
                      stats.totalValue === 0
                        ? 0
                        : Math.round((value / stats.totalValue) * 100);

                    return (
                      <div key={rarity}>
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <Badge
                            className={cn("px-1.5 py-0 text-[10px]", getRarityColor(rarity))}
                            variant="outline"
                          >
                            {rarity}
                          </Badge>
                          <span className="text-xs font-medium">
                            {formatCurrency(value)}
                          </span>
                        </div>
                        <Progress className="h-1.5" value={percentage} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
