import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { SetsPanel } from "@/components/sets-panel";
import {
  SetDetailPanel,
  type CardSortDirection,
  type CardSortKey,
} from "@/components/set-detail-panel";
import { ScanSetsDialog } from "@/components/scan-sets-dialog";
import { CardDetailDialog } from "@/components/card-detail-dialog";
import { CollectionDashboardDialog } from "@/components/collection-dashboard-dialog";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
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
  exportCollection,
  fetchSetCards,
  fetchSets,
  importCollection,
  loadCollections,
  updateCardCollected,
  type DownloadProgress,
  type LoadCollectionsResult,
} from "@/lib/api";

type ActivePane = "sets" | "cards";

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function showImportResults(results: LoadCollectionsResult[]) {
  const successfulImports = results.filter((result) => result.success);
  const failedImports = results.filter((result) => !result.success);

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
          `Success: ${successfulImports
            .map((result) => `${result.setCode} (${result.timeTaken} ms)`)
            .join(", ")}`,
          `Failed: ${failedImports
            .map((result) => `${result.setCode} (${result.timeTaken} ms)`)
            .join(", ")}`,
        ].join(" | "),
      },
    );
    return;
  }

  toast.error("No sets were imported.", {
    description:
      failedImports.length > 0
        ? `Failed: ${failedImports
            .map((result) => `${result.setCode} (${result.timeTaken} ms)`)
            .join(", ")}`
        : "The backend did not import any sets.",
  });
}

function App() {
  const [selectedSet, setSelectedSet] = useState<CardSet | null>(null);
  const [activePane, setActivePane] = useState<ActivePane>("sets");
  const [sets, setSets] = useState<CardSet[]>([]);
  const [cards, setCards] = useState<Record<string, Card[]>>({});
  const [loadedSetIds, setLoadedSetIds] = useState<Set<string>>(new Set());
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardsError, setCardsError] = useState("");
  const [updatingCardIds, setUpdatingCardIds] = useState<Set<string>>(new Set());
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [cardDetailOpen, setCardDetailOpen] = useState(false);
  const [exportDownloading, setExportDownloading] = useState(false);
  const [importProcessing, setImportProcessing] = useState(false);
  const [exportProgress, setExportProgress] = useState<DownloadProgress>({
    downloadedBytes: 0,
    totalBytes: null,
    percent: null,
  });
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const blockingInteraction = exportDownloading || importProcessing;

  // Filter states
  const [setSearchQuery, setSetSearchQuery] = useState("");
  const [cardNameFilter, setCardNameFilter] = useState("");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [ownedFilter, setOwnedFilter] = useState("all");
  const [cardSortKey, setCardSortKey] = useState<CardSortKey>(null);
  const [cardSortDirection, setCardSortDirection] =
    useState<CardSortDirection>("asc");
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);

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

  const handleSetSelect = useCallback((set: CardSet) => {
    setSelectedSet(set);
    setActivePane("cards");
    setFocusedCardId(null);

    // Reset card filters when selecting a new set
    setCardNameFilter("");
    setRarityFilter("all");
    setOwnedFilter("all");
    setCardSortKey(null);
    setCardSortDirection("asc");
  }, []);

  const handleCardCollectedChange = useCallback(async (cardId: string, collected: boolean) => {
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
  }, [selectedSet, updatingCardIds]);

  const handleCardClick = useCallback((card: Card) => {
    setActivePane("cards");
    setFocusedCardId(card.id);
    setSelectedCard(card);
    setCardDetailOpen(true);
  }, []);

  const handleImportSets = async (newSets: CardSet[]) => {
    const setIds = newSets.map((set) => set.id);
    const results = await loadCollections(setIds);
    const successfulImports = results.filter((result) => result.success);

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

    showImportResults(results);
  };

  const handleExportCollection = async () => {
    if (blockingInteraction) {
      return;
    }

    setExportDownloading(true);
    setExportProgress({
      downloadedBytes: 0,
      totalBytes: null,
      percent: null,
    });

    try {
      const { blob, filename } = await exportCollection(setExportProgress);
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);

      toast.success("Collection exported.", {
        description: `${filename} downloaded successfully.`,
      });
    } catch (error) {
      toast.error("Failed to export collection.", {
        description:
          error instanceof Error ? error.message : "The backend rejected the export.",
      });
    } finally {
      setExportDownloading(false);
    }
  };

  const handleImportCollectionSelect = () => {
    if (blockingInteraction) {
      return;
    }

    importFileInputRef.current?.click();
  };

  const handleImportCollectionFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file || importProcessing) {
      return;
    }

    setImportProcessing(true);

    try {
      const results = await importCollection(file);
      await refetchSets();
      setCards({});
      setLoadedSetIds(new Set());
      setSelectedCard(null);
      setCardDetailOpen(false);

      showImportResults(results);
    } catch (error) {
      toast.error("Failed to import collection.", {
        description:
          error instanceof Error ? error.message : "The backend rejected the import.",
      });
    } finally {
      setImportProcessing(false);
    }
  };

  const filteredSets = useMemo(
    () =>
      sets.filter((set) =>
        set.name.toLowerCase().includes(setSearchQuery.toLowerCase()),
      ),
    [sets, setSearchQuery],
  );

  const selectedSetCards = useMemo(
    () => (selectedSet ? (cards[selectedSet.id] ?? []) : []),
    [cards, selectedSet],
  );
  const filteredCards = useMemo(
    () => {
      const visibleCards = selectedSetCards.filter((card) => {
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

      if (!cardSortKey) {
        return visibleCards;
      }

      const getRegularPrice = (card: Card) => card.regularPrice ?? card.price ?? null;
      const getFoilPrice = (card: Card) => card.foilPrice ?? null;
      const directionMultiplier = cardSortDirection === "asc" ? 1 : -1;

      return [...visibleCards].sort((a, b) => {
        if (cardSortKey === "name") {
          return a.name.localeCompare(b.name) * directionMultiplier;
        }

        const aPrice =
          cardSortKey === "regularPrice" ? getRegularPrice(a) : getFoilPrice(a);
        const bPrice =
          cardSortKey === "regularPrice" ? getRegularPrice(b) : getFoilPrice(b);

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
    },
    [
      cardNameFilter,
      cardSortDirection,
      cardSortKey,
      ownedFilter,
      rarityFilter,
      selectedSetCards,
    ],
  );

  const handleCardSortChange = useCallback((sortKey: Exclude<CardSortKey, null>) => {
    setCardSortKey((currentSortKey) => {
      if (currentSortKey === sortKey) {
        setCardSortDirection((currentDirection) =>
          currentDirection === "asc" ? "desc" : "asc",
        );
        return currentSortKey;
      }

      setCardSortDirection("asc");
      return sortKey;
    });
  }, []);

  const selectSetByOffset = useCallback((offset: number) => {
    if (filteredSets.length === 0) {
      return;
    }

    const currentIndex = selectedSet
      ? filteredSets.findIndex((set) => set.id === selectedSet.id)
      : -1;
    const fallbackIndex = offset > 0 ? -1 : filteredSets.length;
    const nextIndex =
      (currentIndex === -1 ? fallbackIndex : currentIndex) + offset;
    const boundedIndex = Math.min(
      Math.max(nextIndex, 0),
      filteredSets.length - 1,
    );

    setActivePane("sets");
    handleSetSelect(filteredSets[boundedIndex]);
    setActivePane("sets");
  }, [filteredSets, handleSetSelect, selectedSet]);

  const focusCardByOffset = useCallback((offset: number) => {
    if (filteredCards.length === 0) {
      return;
    }

    const currentIndex = focusedCardId
      ? filteredCards.findIndex((card) => card.id === focusedCardId)
      : -1;
    const fallbackIndex = offset > 0 ? -1 : filteredCards.length;
    const nextIndex =
      (currentIndex === -1 ? fallbackIndex : currentIndex) + offset;
    const boundedIndex = Math.min(
      Math.max(nextIndex, 0),
      filteredCards.length - 1,
    );

    setActivePane("cards");
    setFocusedCardId(filteredCards[boundedIndex].id);
  }, [filteredCards, focusedCardId]);

  const getFocusedCard = useCallback(() => {
    if (filteredCards.length === 0) {
      return null;
    }

    return (
      filteredCards.find((card) => card.id === focusedCardId) ??
      filteredCards[0] ??
      null
    );
  }, [filteredCards, focusedCardId]);

  const isEditableTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    return Boolean(
      target.closest(
        "input, textarea, select, button, [contenteditable='true'], [role='combobox'], [role='menu'], [role='dialog']",
      ),
    );
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
    if (focusedCardId && filteredCards.some((card) => card.id === focusedCardId)) {
      return;
    }

    setFocusedCardId(filteredCards[0]?.id ?? null);
  }, [filteredCards, focusedCardId]);

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

  useEffect(() => {
    if (!blockingInteraction) {
      return;
    }

    const preventInteraction = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    window.addEventListener("keydown", preventInteraction, true);

    return () => {
      window.removeEventListener("keydown", preventInteraction, true);
    };
  }, [blockingInteraction]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        blockingInteraction ||
        scanDialogOpen ||
        dashboardOpen ||
        cardDetailOpen ||
        isEditableTarget(event.target)
      ) {
        return;
      }

      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "h") {
        event.preventDefault();
        setActivePane("sets");
        return;
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "l") {
        if (selectedSet) {
          event.preventDefault();
          setActivePane("cards");
          setFocusedCardId((currentCardId) => {
            if (
              currentCardId &&
              filteredCards.some((card) => card.id === currentCardId)
            ) {
              return currentCardId;
            }

            return filteredCards[0]?.id ?? null;
          });
        }

        return;
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key.toLowerCase() === "k" ||
        event.key.toLowerCase() === "j"
      ) {
        event.preventDefault();
        const offset =
          event.key === "ArrowDown" || event.key.toLowerCase() === "j" ? 1 : -1;

        if (activePane === "sets") {
          selectSetByOffset(offset);
        } else {
          focusCardByOffset(offset);
        }

        return;
      }

      if (event.key === "Enter" && activePane === "cards") {
        const focusedCard = getFocusedCard();

        if (focusedCard) {
          event.preventDefault();
          handleCardClick(focusedCard);
        }

        return;
      }

      if (event.key === " " && activePane === "cards") {
        const focusedCard = getFocusedCard();

        if (focusedCard && !updatingCardIds.has(focusedCard.id)) {
          event.preventDefault();
          void handleCardCollectedChange(focusedCard.id, !focusedCard.collected);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    activePane,
    blockingInteraction,
    cardDetailOpen,
    dashboardOpen,
    focusCardByOffset,
    filteredCards,
    filteredSets,
    focusedCardId,
    getFocusedCard,
    handleCardCollectedChange,
    handleCardClick,
    scanDialogOpen,
    selectedSet,
    selectSetByOffset,
    updatingCardIds,
  ]);

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
                <DropdownMenuItem
                  disabled={blockingInteraction}
                  onSelect={() => void handleExportCollection()}
                >
                  Export Collection
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={blockingInteraction}
                  onSelect={handleImportCollectionSelect}
                >
                  Import Collection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground rounded-sm cursor-default">
            Edit
          </span>
            <DropdownMenu>
              <DropdownMenuTrigger className="px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground rounded-sm focus:outline-none">
                View
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[200px]">
                <DropdownMenuItem onClick={() => setDashboardOpen(true)}>
                  Collection Dashboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              active={activePane === "sets"}
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
              active={activePane === "cards"}
              focusedCardId={focusedCardId}
              onCardCollectedChange={handleCardCollectedChange}
              updatingCardIds={updatingCardIds}
              cardNameFilter={cardNameFilter}
              onCardNameFilterChange={setCardNameFilter}
              rarityFilter={rarityFilter}
              onRarityFilterChange={setRarityFilter}
              ownedFilter={ownedFilter}
              onOwnedFilterChange={setOwnedFilter}
              sortKey={cardSortKey}
              sortDirection={cardSortDirection}
              onSortChange={handleCardSortChange}
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
        <CollectionDashboardDialog
          open={dashboardOpen}
          onOpenChange={setDashboardOpen}
          sets={sets}
        />
        <input
          ref={importFileInputRef}
          accept=".zip,application/zip,application/x-zip-compressed"
          className="hidden"
          onChange={(event) => void handleImportCollectionFileChange(event)}
          type="file"
        />
        {exportDownloading ? (
          <div
            aria-live="polite"
            aria-modal="true"
            className="fixed inset-0 z-[100] flex cursor-wait items-center justify-center bg-background/70 backdrop-blur-sm"
            role="dialog"
          >
            <div className="w-[min(420px,calc(100vw-2rem))] rounded-lg border border-border bg-card p-4 shadow-lg">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-medium text-foreground">
                    Exporting collection
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Downloading collection.zip
                  </p>
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {exportProgress.percent === null
                    ? formatBytes(exportProgress.downloadedBytes)
                    : `${exportProgress.percent}%`}
                </span>
              </div>
              <Progress
                className={
                  exportProgress.percent === null
                    ? "[&_[data-slot=progress-indicator]]:animate-pulse"
                    : undefined
                }
                value={exportProgress.percent ?? 100}
              />
              <p className="mt-2 text-[11px] text-muted-foreground">
                {exportProgress.totalBytes
                  ? `${formatBytes(exportProgress.downloadedBytes)} of ${formatBytes(
                      exportProgress.totalBytes,
                    )}`
                  : "Waiting for download size..."}
              </p>
            </div>
          </div>
        ) : null}
        {importProcessing ? (
          <div
            aria-live="polite"
            aria-modal="true"
            className="fixed inset-0 z-[100] flex cursor-wait items-center justify-center bg-background/70 backdrop-blur-sm"
            role="dialog"
          >
            <div className="flex w-[min(360px,calc(100vw-2rem))] items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-lg">
              <Spinner className="size-5 text-primary" />
              <div>
                <h2 className="text-sm font-medium text-foreground">
                  Importing collection
                </h2>
                <p className="text-xs text-muted-foreground">
                  Uploading and processing the zip file...
                </p>
              </div>
            </div>
          </div>
        ) : null}
        <Toaster />
      </div>
  );
}

export default App;
