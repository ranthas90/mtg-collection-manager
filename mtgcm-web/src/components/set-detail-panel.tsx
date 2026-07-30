import { type FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  ClipboardList,
  ExternalLink,
  Layers,
  ListPlus,
  Pencil,
  RefreshCw,
  Save,
  Search,
} from "lucide-react";

export type CardSortKey = "name" | "regularPrice" | "foilPrice" | null;
export type CardSortDirection = "asc" | "desc";

interface HoverPreviewState {
  card: Card;
  anchorRect: DOMRect;
}

interface SetDetailPanelProps {
  selectedSet: CardSet | null;
  cards: Card[];
  cardsLoading: boolean;
  cardsError: string;
  active: boolean;
  focusedCardId: string | null;
  onCardCollectedChange: (cardId: string, collected: boolean) => void;
  updatingCardIds: Set<string>;
  cardNameFilter: string;
  onCardNameFilterChange: (value: string) => void;
  rarityFilter: string;
  onRarityFilterChange: (value: string) => void;
  ownedFilter: string;
  onOwnedFilterChange: (value: string) => void;
  sortKey: CardSortKey;
  sortDirection: CardSortDirection;
  onSortChange: (sortKey: Exclude<CardSortKey, null>) => void;
  onCardClick: (card: Card) => void;
  onCardImageUrlChange: (cardId: string, imageUriNormal: string) => Promise<void>;
  onCardPriceRefresh: (cardId: string) => Promise<void>;
  onCardmarketWantslistIdChange: (
    setCode: string,
    cardmarketWantslistId: number,
  ) => Promise<void>;
}

export function SetDetailPanel({
  selectedSet,
  cards = [],
  cardsLoading,
  cardsError,
  active,
  focusedCardId,
  onCardCollectedChange,
  updatingCardIds,
  cardNameFilter,
  onCardNameFilterChange,
  rarityFilter,
  onRarityFilterChange,
  ownedFilter,
  onOwnedFilterChange,
  sortKey,
  sortDirection,
  onSortChange,
  onCardClick,
  onCardImageUrlChange,
  onCardPriceRefresh,
  onCardmarketWantslistIdChange,
}: SetDetailPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [hoverPreview, setHoverPreview] = useState<HoverPreviewState | null>(
    null,
  );
  const [wantslistDialogOpen, setWantslistDialogOpen] = useState(false);
  const [wantslistIdInput, setWantslistIdInput] = useState("");
  const [wantslistSaving, setWantslistSaving] = useState(false);
  const [wantslistError, setWantslistError] = useState("");
  const [purchaseReportOpen, setPurchaseReportOpen] = useState(false);
  const [cardEditDialogOpen, setCardEditDialogOpen] = useState(false);
  const [cardBeingEdited, setCardBeingEdited] = useState<Card | null>(null);
  const [cardImageUrlInput, setCardImageUrlInput] = useState("");
  const [cardImageSaving, setCardImageSaving] = useState(false);
  const [cardPriceRefreshing, setCardPriceRefreshing] = useState(false);
  const [cardEditError, setCardEditError] = useState("");

  useEffect(() => {
    if (!focusedCardId) {
      return;
    }

    document
      .querySelector(`[data-card-row-id="${CSS.escape(focusedCardId)}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [focusedCardId]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer || !hoverPreview) {
      return;
    }

    const clearHoverPreview = () => setHoverPreview(null);

    scrollContainer.addEventListener("scroll", clearHoverPreview, {
      passive: true,
    });
    window.addEventListener("resize", clearHoverPreview);

    return () => {
      scrollContainer.removeEventListener("scroll", clearHoverPreview);
      window.removeEventListener("resize", clearHoverPreview);
    };
  }, [hoverPreview]);

  useEffect(() => {
    if (!selectedSet || wantslistDialogOpen) {
      return;
    }

    setWantslistIdInput(
      selectedSet.cardmarketWantslistId == null
        ? ""
        : String(selectedSet.cardmarketWantslistId),
    );
    setWantslistError("");
  }, [selectedSet, wantslistDialogOpen]);

  useEffect(() => {
    if (!cardBeingEdited) {
      return;
    }

    const updatedCard = cards.find((card) => card.id === cardBeingEdited.id);

    if (updatedCard) {
      setCardBeingEdited(updatedCard);
    }
  }, [cardBeingEdited, cards]);

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

  const formatReportPrice = (price: number) => `EUR ${price.toFixed(2)}`;

  const rarityOrder: Card["rarity"][] = ["mythic", "rare", "uncommon", "common"];

  const getRarityLabel = (rarity: Card["rarity"]) => {
    switch (rarity) {
      case "mythic":
        return "Mythic";
      case "rare":
        return "Rare";
      case "uncommon":
        return "Uncommon";
      case "common":
        return "Common";
      default:
        return rarity;
    }
  };

  const getDisplayValue = (card: Card) => getRegularPrice(card) ?? getFoilPrice(card) ?? 0;

  const getPreviewImageUri = (card: Card) =>
    card.imageUriNormal ?? card.imageUriArtCrop ?? null;

  const showHoverPreview = (card: Card, target: HTMLElement) => {
    if (!getPreviewImageUri(card)) {
      return;
    }

    setHoverPreview({
      card,
      anchorRect: target.getBoundingClientRect(),
    });
  };

  const hideHoverPreview = () => setHoverPreview(null);

  const copyCardNameToClipboard = (cardName: string) => {
    if (!navigator.clipboard) {
      toast.error("Card name could not be copied.", {
        description: "Clipboard access is not available in this browser.",
      });
      return;
    }

    void navigator.clipboard.writeText(cardName).then(
      () => {
        toast.success("Card name copied.", {
          description: cardName,
        });
      },
      () => {
        toast.error("Card name could not be copied.");
      },
    );
  };

  const copyMissingCardsToClipboard = () => {
    if (!navigator.clipboard) {
      toast.error("Missing cards could not be copied.", {
        description: "Clipboard access is not available in this browser.",
      });
      return;
    }

    const missingCardsList = cards
      .filter((card) => !card.collected)
      .map((card) => `1 ${card.name} (${card.setCode ?? selectedSet.id})`)
      .join("\n");

    void navigator.clipboard.writeText(missingCardsList).then(
      () => {
        toast.success("Missing cards copied.", {
          description: `${cards.filter((card) => !card.collected).length} cards copied to the clipboard.`,
        });
      },
      () => {
        toast.error("Missing cards could not be copied.");
      },
    );
  };

  const handleOpenWantslistDialog = () => {
    setWantslistIdInput(
      selectedSet.cardmarketWantslistId == null
        ? ""
        : String(selectedSet.cardmarketWantslistId),
    );
    setWantslistError("");
    setWantslistDialogOpen(true);
  };

  const handleOpenCardEditDialog = (card: Card) => {
    setCardBeingEdited(card);
    setCardImageUrlInput(card.imageUriNormal ?? "");
    setCardEditError("");
    setCardEditDialogOpen(true);
  };

  const handleSaveWantslistId = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedValue = wantslistIdInput.trim();
    const parsedWantslistId = Number(trimmedValue);

    if (
      trimmedValue === "" ||
      !Number.isInteger(parsedWantslistId) ||
      parsedWantslistId <= 0
    ) {
      setWantslistError("Enter a valid wantslist id.");
      return;
    }

    setWantslistSaving(true);
    setWantslistError("");

    try {
      await onCardmarketWantslistIdChange(
        selectedSet.id,
        parsedWantslistId,
      );
      setWantslistDialogOpen(false);
    } catch (error) {
      setWantslistError(
        error instanceof Error
          ? error.message
          : "The wantslist could not be saved.",
      );
    } finally {
      setWantslistSaving(false);
    }
  };

  const handleSaveCardImageUrl = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!cardBeingEdited) {
      return;
    }

    const nextImageUrl = cardImageUrlInput.trim();

    if (nextImageUrl === "") {
      setCardEditError("Enter an image URL.");
      return;
    }

    setCardImageSaving(true);
    setCardEditError("");

    try {
      await onCardImageUrlChange(cardBeingEdited.id, nextImageUrl);
      setCardEditDialogOpen(false);
    } catch (error) {
      setCardEditError(
        error instanceof Error ? error.message : "The image URL could not be saved.",
      );
    } finally {
      setCardImageSaving(false);
    }
  };

  const handleRefreshCardPrice = async () => {
    if (!cardBeingEdited) {
      return;
    }

    setCardPriceRefreshing(true);
    setCardEditError("");

    try {
      await onCardPriceRefresh(cardBeingEdited.id);
    } catch (error) {
      setCardEditError(
        error instanceof Error ? error.message : "The card price could not be refreshed.",
      );
    } finally {
      setCardPriceRefreshing(false);
    }
  };

  const renderSortIcon = (column: Exclude<CardSortKey, null>) => {
    if (sortKey !== column) {
      return <ArrowUpDown className="size-3 text-muted-foreground/70" />;
    }

    return sortDirection === "asc" ? (
      <ArrowUp className="size-3 text-primary" />
    ) : (
      <ArrowDown className="size-3 text-primary" />
    );
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

  const sortedCards = [...filteredCards].sort((a, b) => {
    if (!sortKey) {
      return 0;
    }

    const directionMultiplier = sortDirection === "asc" ? 1 : -1;

    if (sortKey === "name") {
      return a.name.localeCompare(b.name) * directionMultiplier;
    }

    const aPrice = sortKey === "regularPrice" ? getRegularPrice(a) : getFoilPrice(a);
    const bPrice = sortKey === "regularPrice" ? getRegularPrice(b) : getFoilPrice(b);

    if (aPrice === null && bPrice === null) {
      return a.name.localeCompare(b.name);
    }

    if (aPrice === null) {
      return 1;
    }

    if (bPrice === null) {
      return -1;
    }

    return (aPrice - bPrice) * directionMultiplier;
  });

  const totalValue = cards.reduce((sum, card) => sum + getDisplayValue(card), 0);
  const collectedValue = cards
    .filter((c) => c.collected)
    .reduce((sum, card) => sum + getDisplayValue(card), 0);
  const previewImageUri = hoverPreview ? getPreviewImageUri(hoverPreview.card) : null;
  const previewWidth = 288;
  const previewHeight = 402;
  const previewGap = 16;
  const viewportPadding = 16;
  const previewTop = hoverPreview
    ? Math.min(
        Math.max(hoverPreview.anchorRect.top - 12, viewportPadding),
        window.innerHeight - previewHeight - viewportPadding,
      )
    : 0;
  const previewLeft = hoverPreview
    ? hoverPreview.anchorRect.right + previewWidth + previewGap <= window.innerWidth
      ? hoverPreview.anchorRect.right + previewGap
      : Math.max(
          viewportPadding,
          hoverPreview.anchorRect.left - previewWidth - previewGap,
        )
    : 0;
  const cardmarketAddCardsUrl =
    selectedSet.cardmarketWantslistId == null
      ? null
      : `https://www.cardmarket.com/es/Magic/Wants/${selectedSet.cardmarketWantslistId}/AddCards#&searchMode=v2`;
  const cardmarketAddDeckListUrl =
    selectedSet.cardmarketWantslistId == null
      ? null
      : `https://www.cardmarket.com/es/Magic/Wants/${selectedSet.cardmarketWantslistId}/AddDeckList`;
  const missingCards = cards.filter((card) => !card.collected);
  const missingCardsCount = missingCards.length;
  const missingCardsReport = rarityOrder
    .map((rarity) => {
      const cardsByRarity = missingCards.filter((card) => card.rarity === rarity);

      return {
        rarity,
        count: cardsByRarity.length,
        totalPrice: cardsByRarity.reduce(
          (sum, card) => sum + getDisplayValue(card),
          0,
        ),
      };
    })
    .filter((item) => item.count > 0);
  const missingCardsTotalPrice = missingCardsReport.reduce(
    (sum, item) => sum + item.totalPrice,
    0,
  );

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
            <div className="mb-1 flex items-center gap-2">
              {selectedSet.cardmarketWantslistId == null ? null : (
                <Button asChild size="sm" variant="outline">
                  <a
                    href={`https://www.cardmarket.com/es/Magic/Wants/${selectedSet.cardmarketWantslistId}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ExternalLink className="size-3.5" />
                    View wantslist
                  </a>
                </Button>
              )}
              {cardmarketAddDeckListUrl && missingCardsCount > 0 ? (
                <Button asChild size="sm" variant="outline">
                  <a
                    href={cardmarketAddDeckListUrl}
                    onClick={() => copyMissingCardsToClipboard()}
                    rel="noreferrer"
                    target="_blank"
                    title="Copy missing cards and open Cardmarket decklist import"
                  >
                    <ClipboardList className="size-3.5" />
                    Add missing
                  </a>
                </Button>
              ) : null}
              <Button
                disabled={cardsLoading || cardsError !== "" || cards.length === 0}
                onClick={() => setPurchaseReportOpen(true)}
                size="sm"
                type="button"
                variant="outline"
              >
                <BarChart3 className="size-3.5" />
                Purchase report
              </Button>
              <Button
                onClick={handleOpenWantslistDialog}
                size="sm"
                type="button"
                variant={
                  selectedSet.cardmarketWantslistId == null ? "default" : "outline"
                }
              >
                {selectedSet.cardmarketWantslistId == null ? (
                  <ListPlus className="size-3.5" />
                ) : (
                  <Pencil className="size-3.5" />
                )}
                {selectedSet.cardmarketWantslistId == null
                  ? "Link wantslist"
                  : "Edit wantslist"}
              </Button>
            </div>
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
      <div ref={scrollContainerRef} className="flex-1 overflow-auto">
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
                  <button
                    className="inline-flex items-center gap-1 hover:text-foreground"
                    onClick={() => onSortChange("name")}
                    type="button"
                  >
                    Name
                    {renderSortIcon("name")}
                  </button>
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
                  <button
                    className="ml-auto inline-flex items-center gap-1 hover:text-foreground"
                    onClick={() => onSortChange("regularPrice")}
                    type="button"
                  >
                    Regular Price
                    {renderSortIcon("regularPrice")}
                  </button>
                </TableHead>
                <TableHead className="h-8 text-[11px] font-medium text-muted-foreground text-right">
                  <button
                    className="ml-auto inline-flex items-center gap-1 hover:text-foreground"
                    onClick={() => onSortChange("foilPrice")}
                    type="button"
                  >
                    Foil Price
                    {renderSortIcon("foilPrice")}
                  </button>
                </TableHead>
                <TableHead className="h-8 w-16 text-[11px] font-medium text-muted-foreground text-center">
                  Owned
                </TableHead>
                <TableHead className="h-8 w-16 text-[11px] font-medium text-muted-foreground text-center">
                  Edit
                </TableHead>
                {cardmarketAddCardsUrl ? (
                  <TableHead className="h-8 w-20 text-[11px] font-medium text-muted-foreground text-center">
                    Wants
                  </TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCards.map((card) => (
                <TableRow
                  key={card.id}
                  data-card-row-id={card.id}
                  onClick={() => onCardClick(card)}
                  className={cn(
                    "border-border cursor-pointer",
                    active && focusedCardId === card.id
                      ? "bg-primary/15 ring-1 ring-inset ring-primary/35 hover:bg-primary/20"
                      : card.collected
                      ? "bg-primary/5 hover:bg-primary/10"
                      : "hover:bg-secondary",
                  )}
                >
                  <TableCell className="py-1.5 text-xs text-muted-foreground font-mono">
                    {card.collectionNumber.padStart(3, "0")}
                  </TableCell>
                  <TableCell className="py-1.5">
                    {card.imageUriArtCrop ? (
                      <div
                        className="flex h-10 w-16 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-muted/40 shadow-sm"
                        onMouseEnter={(event) =>
                          showHoverPreview(card, event.currentTarget)
                        }
                        onMouseLeave={hideHoverPreview}
                      >
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
                        "inline-block text-xs font-medium",
                        card.collected
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                      onMouseEnter={(event) =>
                        showHoverPreview(card, event.currentTarget)
                      }
                      onMouseLeave={hideHoverPreview}
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
                  <TableCell className="py-1.5 text-center">
                    <Button
                      aria-label={`Editar carta ${card.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleOpenCardEditDialog(card);
                      }}
                      size="icon-xs"
                      title="Editar carta"
                      type="button"
                      variant="ghost"
                    >
                      <Pencil className="size-3" />
                    </Button>
                  </TableCell>
                  {cardmarketAddCardsUrl ? (
                    <TableCell className="py-1.5 text-center">
                      {card.collected ? null : (
                        <Button asChild size="icon-xs" variant="ghost">
                          <a
                            aria-label={`Copy ${card.name} and open Cardmarket wantslist add cards`}
                            href={cardmarketAddCardsUrl}
                            onClick={(event) => {
                              event.stopPropagation();
                              copyCardNameToClipboard(card.name);
                            }}
                            rel="noreferrer"
                            target="_blank"
                            title="Copy card name and open Cardmarket"
                          >
                            <ExternalLink className="size-3" />
                          </a>
                        </Button>
                      )}
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
              {filteredCards.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={cardmarketAddCardsUrl ? 11 : 10}
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
      {hoverPreview && previewImageUri
        ? createPortal(
            <div
              className="pointer-events-none fixed z-50 hidden sm:block"
              style={{
                left: `${previewLeft}px`,
                top: `${previewTop}px`,
              }}
            >
              <div className="w-72 overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl">
                <img
                  src={previewImageUri}
                  alt={hoverPreview.card.name}
                  className="w-72 bg-muted object-cover"
                />
                <div className="border-t border-border/70 px-3 py-2">
                  <div className="truncate text-sm font-semibold text-foreground">
                    {hoverPreview.card.name}
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
                    <span>#{hoverPreview.card.collectionNumber.padStart(3, "0")}</span>
                    <span className="truncate">{hoverPreview.card.type}</span>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
      <Dialog
        open={wantslistDialogOpen}
        onOpenChange={(open) => {
          if (!wantslistSaving) {
            setWantslistDialogOpen(open);
          }
        }}
      >
        <DialogContent>
          <form onSubmit={(event) => void handleSaveWantslistId(event)}>
            <DialogHeader>
              <DialogTitle>
                {selectedSet.cardmarketWantslistId == null
                  ? "Link wantslist"
                  : "Edit wantslist"}
              </DialogTitle>
              <DialogDescription>
                Enter the Cardmarket wantslist id associated with this set.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <Input
                autoFocus
                inputMode="numeric"
                min={1}
                onChange={(event) => {
                  setWantslistIdInput(event.target.value);
                  setWantslistError("");
                }}
                placeholder="Wantslist id"
                type="number"
                value={wantslistIdInput}
              />
              {wantslistError ? (
                <p className="mt-2 text-xs text-destructive">{wantslistError}</p>
              ) : null}
            </div>
            <DialogFooter>
              <Button
                disabled={wantslistSaving}
                onClick={() => setWantslistDialogOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={wantslistSaving} type="submit">
                {wantslistSaving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={cardEditDialogOpen}
        onOpenChange={(open) => {
          if (!cardImageSaving && !cardPriceRefreshing) {
            setCardEditDialogOpen(open);
          }
        }}
      >
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[520px]">
          <form onSubmit={(event) => void handleSaveCardImageUrl(event)}>
            <DialogHeader>
              <DialogTitle>Editar carta</DialogTitle>
              <DialogDescription>
                {cardBeingEdited
                  ? `${cardBeingEdited.name} #${cardBeingEdited.collectionNumber.padStart(3, "0")}`
                  : "Edit card details."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-border bg-card p-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Regular Price
                  </span>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {cardBeingEdited
                      ? formatPrice(getRegularPrice(cardBeingEdited))
                      : "N/A"}
                  </p>
                </div>
                <div className="rounded-md border border-border bg-card p-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Foil Price
                  </span>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {cardBeingEdited
                      ? formatPrice(getFoilPrice(cardBeingEdited))
                      : "N/A"}
                  </p>
                </div>
              </div>
              <Button
                className="w-full"
                disabled={!cardBeingEdited || cardImageSaving || cardPriceRefreshing}
                onClick={() => void handleRefreshCardPrice()}
                type="button"
                variant="outline"
              >
                <RefreshCw
                  className={cn("size-3.5", cardPriceRefreshing && "animate-spin")}
                />
                {cardPriceRefreshing ? "Actualizando precio..." : "Actualizar precio"}
              </Button>
              <div className="space-y-2">
                <label
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  htmlFor="card-image-url"
                >
                  URL de imagen
                </label>
                <Input
                  id="card-image-url"
                  onChange={(event) => {
                    setCardImageUrlInput(event.target.value);
                    setCardEditError("");
                  }}
                  placeholder="https://..."
                  type="url"
                  value={cardImageUrlInput}
                />
              </div>
              {cardEditError ? (
                <p className="text-xs text-destructive">{cardEditError}</p>
              ) : null}
            </div>
            <DialogFooter>
              <Button
                disabled={cardImageSaving || cardPriceRefreshing}
                onClick={() => setCardEditDialogOpen(false)}
                type="button"
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                disabled={!cardBeingEdited || cardImageSaving || cardPriceRefreshing}
                type="submit"
              >
                <Save className="size-3.5" />
                {cardImageSaving ? "Guardando..." : "Guardar URL"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={purchaseReportOpen} onOpenChange={setPurchaseReportOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Purchase report</DialogTitle>
            <DialogDescription>
              Missing cards grouped by rarity for {selectedSet.name}.
            </DialogDescription>
          </DialogHeader>
          {missingCardsCount === 0 ? (
            <div className="rounded-md border border-border bg-card p-4 text-sm text-muted-foreground">
              This set is complete. There are no missing cards to buy.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-border bg-card p-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Missing Cards
                  </span>
                  <p className="mt-1 text-xl font-semibold text-foreground">
                    {missingCardsCount}
                  </p>
                </div>
                <div className="rounded-md border border-border bg-card p-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Estimated Total
                  </span>
                  <p className="mt-1 text-xl font-semibold text-primary">
                    {formatReportPrice(missingCardsTotalPrice)}
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="h-8 text-[11px]">Rarity</TableHead>
                      <TableHead className="h-8 text-right text-[11px]">
                        Cards
                      </TableHead>
                      <TableHead className="h-8 text-right text-[11px]">
                        Total Price
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missingCardsReport.map((item) => (
                      <TableRow key={item.rarity}>
                        <TableCell className="py-2">
                          <Badge
                            className={cn(
                              "px-1.5 py-0 text-[10px]",
                              getRarityColor(item.rarity),
                            )}
                            variant="outline"
                          >
                            {getRarityLabel(item.rarity)}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 text-right text-xs font-medium text-foreground">
                          {item.count}
                        </TableCell>
                        <TableCell className="py-2 text-right text-xs font-medium text-primary">
                          {formatReportPrice(item.totalPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </div>
  );
}
