import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { SetsPanel } from "@/components/sets-panel";
import { SetDetailPanel } from "@/components/set-detail-panel";
import { ScanSetsDialog } from "@/components/scan-sets-dialog";
import { CardDetailDialog } from "@/components/card-detail-dialog";
import { Toaster } from "@/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CardSet, Card } from "@/lib/data";
import {
  fetchSetCards,
  fetchSets,
  loadCollections,
  updateCardCollected,
} from "@/lib/api";

function App() {
  const [selectedSet, setSelectedSet] = useState<CardSet | null>(null);
  const [sets, setSets] = useState<CardSet[]>([]);
  const [cards, setCards] = useState<Record<string, Card[]>>({});
  const [loadedSetIds, setLoadedSetIds] = useState<Set<string>>(new Set());
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardsError, setCardsError] = useState("");
  const [updatingCardIds, setUpdatingCardIds] = useState<Set<string>>(new Set());
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [cardDetailOpen, setCardDetailOpen] = useState(false);

  // Filter states
  const [setSearchQuery, setSetSearchQuery] = useState("");
  const [cardNameFilter, setCardNameFilter] = useState("");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [ownedFilter, setOwnedFilter] = useState("all");

  const {
    data: fetchedSets,
    isLoading: setsLoading,
    isError: setsError,
    error: setsQueryError,
    refetch: refetchSets,
  } = useQuery({
    queryKey: ["sets"],
    queryFn: fetchSets,
  });

  const handleSetSelect = (set: CardSet) => {
    setSelectedSet(set);

    // Reset card filters when selecting a new set
    setCardNameFilter("");
    setRarityFilter("all");
    setOwnedFilter("all");
  };

  const handleCardCollectedChange = async (cardId: string, collected: boolean) => {
    if (!selectedSet) return;
    if (updatingCardIds.has(cardId)) return;

    const setId = selectedSet.id;
    setUpdatingCardIds((prev) => new Set(prev).add(cardId));

    try {
      const updatedCard = await updateCardCollected(setId, cardId, collected);

      setCards((prev) => {
        const currentCards = prev[setId] ?? [];
        const updatedCards = currentCards.map((card) =>
          card.id === cardId ? updatedCard : card,
        );

        const collectedCount = updatedCards.filter((card) => card.collected).length;

        setSets((currentSets) =>
          currentSets.map((set) =>
            set.id === setId ? { ...set, collectedCards: collectedCount } : set,
          ),
        );
        setSelectedSet((currentSelectedSet) =>
          currentSelectedSet?.id === setId
            ? { ...currentSelectedSet, collectedCards: collectedCount }
            : currentSelectedSet,
        );

        return { ...prev, [setId]: updatedCards };
      });

      setSelectedCard((prev) => (prev?.id === cardId ? updatedCard : prev));
    } catch (error) {
      toast.error("Failed to update collected status.", {
        description:
          error instanceof Error ? error.message : "The backend rejected the card update.",
      });
    } finally {
      setUpdatingCardIds((prev) => {
        const next = new Set(prev);
        next.delete(cardId);
        return next;
      });
    }
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setCardDetailOpen(true);
  };

  const handleImportSets = async (newSets: CardSet[]) => {
    const setIds = newSets.map((set) => set.id);
    const results = await loadCollections(setIds);
    const successfulImports = results.filter((result) => result.success);
    const failedImports = results.filter((result) => !result.success);

    await refetchSets();

    setCards((prev) => {
      const updated = { ...prev };
      for (const result of successfulImports) {
        updated[result.setCode] = updated[result.setCode] ?? [];
      }
      return updated;
    });

    setLoadedSetIds((prev) => {
      const next = new Set(prev);
      for (const result of successfulImports) {
        next.delete(result.setCode);
      }
      return next;
    });

    if (successfulImports.length > 0 && failedImports.length === 0) {
      toast.success(
        `Imported ${successfulImports.length} set${successfulImports.length === 1 ? "" : "s"}.`,
        {
          description: successfulImports
            .map((result) => `${result.setCode} (${result.timeTaken} ms)`)
            .join(", "),
        },
      );
      return;
    }

    if (successfulImports.length > 0) {
      toast.warning(
        `Imported ${successfulImports.length} set${successfulImports.length === 1 ? "" : "s"}, ${failedImports.length} failed.`,
        {
          description: [
            successfulImports.length > 0
              ? `Success: ${successfulImports.map((result) => result.setCode).join(", ")}`
              : "",
            failedImports.length > 0
              ? `Failed: ${failedImports.map((result) => result.setCode).join(", ")}`
              : "",
          ]
            .filter(Boolean)
            .join(" | "),
        },
      );
      return;
    }

    toast.error("No sets were imported.", {
      description:
        failedImports.length > 0
          ? `Failed: ${failedImports.map((result) => result.setCode).join(", ")}`
          : "The backend did not import any selected sets.",
    });
  };

  useEffect(() => {
    if (!fetchedSets) {
      return;
    }

    setSets((prev) => {
      const importedOnly = prev.filter(
        (existingSet) => !fetchedSets.some((fetchedSet) => fetchedSet.id === existingSet.id),
      );
      const combined = [...fetchedSets, ...importedOnly];

      return combined.sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
      );
    });
  }, [fetchedSets]);

  useEffect(() => {
    if (!selectedSet) {
      return;
    }

    const updatedSelectedSet = sets.find((set) => set.id === selectedSet.id) ?? null;
    setSelectedSet(updatedSelectedSet);
  }, [selectedSet, sets]);

  useEffect(() => {
    if (!selectedSet) {
      setCardsLoading(false);
      setCardsError("");
      return;
    }

    if (loadedSetIds.has(selectedSet.id)) {
      setCardsLoading(false);
      setCardsError("");
      return;
    }

    let ignore = false;

    const loadCards = async () => {
      setCardsLoading(true);
      setCardsError("");

      try {
        const fetchedCards = await fetchSetCards(selectedSet.id);

        if (ignore) {
          return;
        }

        setCards((prev) => ({ ...prev, [selectedSet.id]: fetchedCards }));
        setLoadedSetIds((prev) => new Set(prev).add(selectedSet.id));
      } catch (error) {
        if (ignore) {
          return;
        }

        setCardsError(
          error instanceof Error ? error.message : "Failed to fetch set cards",
        );
      } finally {
        if (!ignore) {
          setCardsLoading(false);
        }
      }
    };

    void loadCards();

    return () => {
      ignore = true;
    };
  }, [loadedSetIds, selectedSet]);

  return (
      <div className="flex h-screen flex-col bg-background">
        {/* Title Bar */}
        <header className="flex h-8 items-center border-b border-border bg-secondary px-3">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-primary" />
            <span className="text-xs font-medium text-foreground">
            Card Collection Manager
          </span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground">v1.0.0</span>
          </div>
        </header>

        {/* Menu Bar */}
        <div className="flex h-7 items-center border-b border-border bg-card px-2">
          <nav className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger className="px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground rounded-sm focus:outline-none">
                File
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[180px]">
                <DropdownMenuItem onClick={() => setScanDialogOpen(true)}>
                  Scan for New Sets...
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Export Collection</DropdownMenuItem>
                <DropdownMenuItem disabled>Import Collection</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground rounded-sm cursor-default">
            Edit
          </span>
            <span className="px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground rounded-sm cursor-default">
            View
          </span>
            <span className="px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground rounded-sm cursor-default">
            Help
          </span>
          </nav>
        </div>

        {/* Main Content - Master-Detail Layout */}
        <main className="flex flex-1 overflow-hidden">
          {/* Sets Panel (Left) */}
          <SetsPanel
              sets={sets}
              selectedSet={selectedSet}
              onSetSelect={handleSetSelect}
              searchQuery={setSearchQuery}
              onSearchChange={setSetSearchQuery}
          />

          {/* Set Detail Panel (Right) */}
          <SetDetailPanel
              selectedSet={selectedSet}
              cards={selectedSet ? cards[selectedSet.id] : []}
              cardsLoading={cardsLoading}
              cardsError={cardsError}
              onCardCollectedChange={handleCardCollectedChange}
              updatingCardIds={updatingCardIds}
              cardNameFilter={cardNameFilter}
              onCardNameFilterChange={setCardNameFilter}
              rarityFilter={rarityFilter}
              onRarityFilterChange={setRarityFilter}
              ownedFilter={ownedFilter}
              onOwnedFilterChange={setOwnedFilter}
              onCardClick={handleCardClick}
          />
        </main>

        {/* Status Bar */}
        <footer className="flex h-6 items-center justify-between border-t border-border bg-secondary px-3">
        <span className="text-[10px] text-muted-foreground">
          {setsLoading
              ? "Loading sets..."
              : setsError
                ? `Failed to load sets: ${setsQueryError instanceof Error ? setsQueryError.message : "Unknown error"}`
                : `${sets.length} sets loaded`}
        </span>
          <span className="text-[10px] text-muted-foreground">
          {selectedSet
              ? `${selectedSet.collectedCards}/${selectedSet.totalCards} cards collected`
              : "Select a set to view details"}
        </span>
        </footer>

        {/* Scan Sets Dialog */}
        <ScanSetsDialog
            open={scanDialogOpen}
            onOpenChange={setScanDialogOpen}
            onImportSets={handleImportSets}
        />

        {/* Card Detail Dialog */}
        <CardDetailDialog
            card={selectedCard}
            open={cardDetailOpen}
            onOpenChange={setCardDetailOpen}
            onCollectedChange={handleCardCollectedChange}
            updatingCardIds={updatingCardIds}
        />
        <Toaster />
      </div>
  );
}

export default App;
