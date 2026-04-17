import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ManaCost } from "@/components/mana-cost";
import { OracleText } from "@/components/oracle-text";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Card } from "@/lib/data";
import { cn } from "@/lib/utils";

interface CardDetailDialogProps {
  card: Card | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCollectedChange: (cardId: string, collected: boolean) => void;
  updatingCardIds: Set<string>;
}

export function CardDetailDialog({
  card,
  open,
  onOpenChange,
  onCollectedChange,
  updatingCardIds,
}: CardDetailDialogProps) {
  if (!card) return null;

  const regularPrice = card.regularPrice ?? card.price ?? null;
  const foilPrice = card.foilPrice ?? null;

  const formatPrice = (price: number | null) =>
    price === null ? "N/A" : `$${price.toFixed(2)}`;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] p-0 overflow-hidden sm:w-[calc(100vw-4rem)] sm:max-w-[980px]">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-lg">{card.name}</DialogTitle>
        </DialogHeader>
        <div className="flex max-h-[85vh] flex-col gap-4 overflow-y-auto p-4 md:flex-row">
          {/* Card Image */}
          <div className="shrink-0 self-center md:self-start">
            {card.imageUriNormal ? (
              <img
                src={card.imageUriNormal}
                alt={card.name}
                className="w-48 rounded-lg shadow-md sm:w-56"
              />
            ) : (
              <div className="flex h-80 w-48 items-center justify-center rounded-lg bg-muted sm:w-56">
                <span className="text-xs text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          {/* Card Details */}
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {/* Type and Rarity */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="break-words text-sm text-muted-foreground">
                {card.type}
              </span>
              <Badge
                variant="outline"
                className={cn("text-xs", getRarityColor(card.rarity))}
              >
                {card.rarity}
              </Badge>
            </div>

            {/* Mana Cost */}
            {card.manaCost && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Mana Cost
                </span>
                <ManaCost
                  manaCost={card.manaCost}
                  className="text-sm"
                  iconClassName="size-5"
                />
              </div>
            )}

            {/* Oracle Text */}
            {card.oracleText && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Card Text
                </span>
                <OracleText text={card.oracleText} />
              </div>
            )}

            {/* Power/Toughness */}
            {card.power && card.toughness && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  P/T
                </span>
                <span className="text-sm font-semibold">
                  {card.power}/{card.toughness}
                </span>
              </div>
            )}

            {/* Set Info */}
            {card.setName && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Set
                </span>
                <span className="break-words text-sm">
                  {card.setName} ({card.setCode?.toUpperCase()}) #
                  {card.collectionNumber.padStart(3, "0")}
                </span>
              </div>
            )}

            {/* Artist */}
            {card.artist && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Artist
                </span>
                <span className="break-words text-sm">{card.artist}</span>
              </div>
            )}

            {/* Prices */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Regular
                </span>
                <span className="text-sm font-semibold text-primary">
                  {formatPrice(regularPrice)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Foil
                </span>
                <span className="text-sm font-semibold text-primary">
                  {formatPrice(foilPrice)}
                </span>
              </div>
            </div>

            {/* Collected Status */}
            <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-2">
              <Checkbox
                id="collected-status"
                checked={card.collected}
                disabled={updatingCardIds.has(card.id)}
                onCheckedChange={(checked) =>
                  void onCollectedChange(card.id, checked as boolean)
                }
              />
              <label
                htmlFor="collected-status"
                className="text-sm font-medium cursor-pointer"
              >
                {card.collected ? "In Collection" : "Not Collected"}
              </label>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
