import { useEffect, useState } from "react";
import { SetsPanel } from "@/components/sets-panel";
import { SetDetailPanel } from "@/components/set-detail-panel";
import { ScanSetsDialog } from "@/components/scan-sets-dialog";
import { CardDetailDialog } from "@/components/card-detail-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CardSet, Card } from "@/lib/data";
import { mockSets, mockCards } from "@/lib/data";

function App() {
  const [selectedSet, setSelectedSet] = useState<CardSet | null>(null);
  const [sets, setSets] = useState<CardSet[]>([]);
  const [cards, setCards] = useState<Record<string, Card[]>>(mockCards);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [cardDetailOpen, setCardDetailOpen] = useState(false);

  // Filter states
  const [setSearchQuery, setSetSearchQuery] = useState("");
  const [cardNameFilter, setCardNameFilter] = useState("");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [ownedFilter, setOwnedFilter] = useState("all");

  const handleSetSelect = (set: CardSet) => {
    setSelectedSet(set);
    // todo: fetchear cartas del set desde el back y añadirlas al estado

    // Reset card filters when selecting a new set
    setCardNameFilter("");
    setRarityFilter("all");
    setOwnedFilter("all");
  };

  const handleCardCollectedChange = (cardId: string, collected: boolean) => {
    if (!selectedSet) return;

    const setId = selectedSet.id;
    const updatedCards = cards[setId].map((card) =>
        card.id === cardId ? { ...card, collected } : card,
    );

    setCards((prev) => ({ ...prev, [setId]: updatedCards }));

    // Update set progress
    const collectedCount = updatedCards.filter((c) => c.collected).length;
    setSets((prev) =>
        prev.map((s) =>
            s.id === setId ? { ...s, collectedCards: collectedCount } : s,
        ),
    );
    setSelectedSet((prev) =>
        prev?.id === setId ? { ...prev, collectedCards: collectedCount } : prev,
    );

    // Update selected card if it's the one being changed
    setSelectedCard((prev) =>
        prev?.id === cardId ? { ...prev, collected } : prev,
    );
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setCardDetailOpen(true);
  };

  const handleImportSets = (newSets: CardSet[]) => {
    // Add new sets to the collection (sorted by release date, newest first)
    setSets((prev) => {
      const combined = [...prev, ...newSets];
      return combined.sort(
          (a, b) =>
              new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
      );
    });

    // Initialize empty card arrays for new sets
    setCards((prev) => {
      const updated = { ...prev };
      for (const set of newSets) {
        updated[set.id] = [];
      }
      return updated;
    });
  };

  useEffect(() => {
    /*
    invoke("fetch_collection")
        .then((data) => setSets(data as CardSet[]))
        .catch((e) => console.error(e));

     */
  }, []);

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
              onCardCollectedChange={handleCardCollectedChange}
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
          {sets.length} sets loaded
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
            existingSets={sets}
            onImportSets={handleImportSets}
        />

        {/* Card Detail Dialog */}
        <CardDetailDialog
            card={selectedCard}
            open={cardDetailOpen}
            onOpenChange={setCardDetailOpen}
            onCollectedChange={handleCardCollectedChange}
        />
      </div>
  );
}

export default App;
