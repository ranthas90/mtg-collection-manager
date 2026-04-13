import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
}

export function CardDetailDialog({
  card,
  open,
  onOpenChange,
  onCollectedChange,
}: CardDetailDialogProps) {
  if (!card) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-lg">{card.name}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 p-4">
          {/* Card Image */}
          <div className="shrink-0">
            {card.imageUri ? (
              <img
                src={card.imageUri}
                alt={card.name}
                className="w-56 rounded-lg shadow-md"
              />
            ) : (
              <div className="w-56 h-80 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          {/* Card Details */}
          <div className="flex flex-1 flex-col gap-3">
            {/* Type and Rarity */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">{card.type}</span>
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
                <span className="text-sm font-mono">{card.manaCost}</span>
              </div>
            )}

            {/* Oracle Text */}
            {card.oracleText && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Card Text
                </span>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {card.oracleText}
                </p>
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
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Set
                </span>
                <span className="text-sm">
                  {card.setName} ({card.setCode?.toUpperCase()}) #
                  {String(card.sortNumber).padStart(3, "0")}
                </span>
              </div>
            )}

            {/* Artist */}
            {card.artist && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Artist
                </span>
                <span className="text-sm">{card.artist}</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Price
              </span>
              <span className="text-sm font-semibold text-primary">
                ${card.price.toFixed(2)}
              </span>
            </div>

            {/* Collected Status */}
            <div className="mt-auto flex items-center gap-2 pt-2 border-t border-border">
              <Checkbox
                id="collected-status"
                checked={card.collected}
                onCheckedChange={(checked) =>
                  onCollectedChange(card.id, checked as boolean)
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
