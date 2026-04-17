import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { fetchMissingSets } from "@/lib/api";
import type { CardSet } from "@/lib/data";

type ScanState = "idle" | "scanning" | "results" | "importing" | "error";

interface ScanSetsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSets: (sets: CardSet[]) => Promise<void>;
}

export function ScanSetsDialog({
  open,
  onOpenChange,
  onImportSets,
}: ScanSetsDialogProps) {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [missingSets, setMissingSets] = useState<CardSet[]>([]);
  const [selectedSetIds, setSelectedSetIds] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState("");

  const handleScan = async () => {
    setScanState("scanning");
    setErrorMessage("");
    setSelectedSetIds(new Set());

    try {
      const missing = await fetchMissingSets();
      setMissingSets(missing);
      setScanState("results");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to scan for sets",
      );
      setScanState("error");
    }
  };

  const handleToggleSet = (setId: string) => {
    setSelectedSetIds((prev) => {
      const next = new Set(prev);
      if (next.has(setId)) {
        next.delete(setId);
      } else {
        next.add(setId);
      }
      return next;
    });
  };

  const handleToggleAll = () => {
    if (selectedSetIds.size === missingSets.length) {
      setSelectedSetIds(new Set());
    } else {
      setSelectedSetIds(new Set(missingSets.map((s) => s.id)));
    }
  };

  const handleImport = async () => {
    const setsToImport = missingSets.filter((s) => selectedSetIds.has(s.id));
    setScanState("importing");

    try {
      await onImportSets(setsToImport);
      handleClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to import sets",
      );
      setScanState("error");
    }
  };

  const handleClose = () => {
    setScanState("idle");
    setMissingSets([]);
    setSelectedSetIds(new Set());
    setErrorMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[85vh] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] flex-col p-4 sm:w-[calc(100vw-4rem)] sm:max-w-[960px]">
        <DialogHeader>
          <DialogTitle>Scan for New Sets</DialogTitle>
          <DialogDescription>
            {scanState === "idle" &&
              "Fetch missing sets from the local backend and import them into your collection."}
            {scanState === "scanning" && "Fetching missing sets from the backend..."}
            {scanState === "importing" && "Importing selected sets into the backend..."}
            {scanState === "results" &&
              `Found ${missingSets.length} sets not in your collection.`}
            {scanState === "error" && "An error occurred while scanning."}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[300px] min-w-0 flex-1 overflow-y-auto">
          {scanState === "idle" && (
            <div className="flex h-[300px] flex-col items-center justify-center gap-4 text-muted-foreground">
              <p className="text-sm">
                Click the button below to scan for missing sets.
              </p>
              <Button onClick={handleScan}>Start Scan</Button>
            </div>
          )}

          {scanState === "scanning" && (
            <div className="flex h-[300px] flex-col items-center justify-center gap-4">
              <Spinner className="size-8" />
              <p className="text-sm text-muted-foreground">
                Fetching missing sets...
              </p>
            </div>
          )}

          {scanState === "importing" && (
            <div className="flex h-[300px] flex-col items-center justify-center gap-4">
              <Spinner className="size-8" />
              <p className="text-sm text-muted-foreground">
                Importing selected sets...
              </p>
            </div>
          )}

          {scanState === "error" && (
            <div className="flex h-[300px] flex-col items-center justify-center gap-4">
              <p className="text-sm text-destructive">{errorMessage}</p>
              <Button onClick={handleScan} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {scanState === "results" && (
            <>
              {missingSets.length === 0 ? (
                <div className="flex h-[300px] flex-col items-center justify-center gap-2 text-muted-foreground">
                  <p className="text-sm">
                    Your collection is up to date! No new sets found.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] rounded border border-border">
                  <div className="min-w-0 overflow-x-auto">
                    <Table className="min-w-[720px]">
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-10">
                            <Checkbox
                              checked={
                                selectedSetIds.size === missingSets.length &&
                                missingSets.length > 0
                              }
                              onCheckedChange={handleToggleAll}
                              aria-label="Select all sets"
                            />
                          </TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="w-28">Type</TableHead>
                          <TableHead className="w-28">Release Date</TableHead>
                          <TableHead className="w-20 text-right">Cards</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {missingSets.map((set) => (
                          <TableRow
                            key={set.id}
                            className="cursor-pointer hover:bg-muted/30"
                            onClick={() => handleToggleSet(set.id)}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedSetIds.has(set.id)}
                                onCheckedChange={() => handleToggleSet(set.id)}
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`Select ${set.name}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {set.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {set.type}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {set.releaseDate}
                            </TableCell>
                            <TableCell className="text-right">
                              {set.totalCards}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              )}
            </>
          )}
        </div>

        <DialogFooter className="items-start gap-2 sm:flex-wrap sm:items-center sm:gap-2">
          <div className="min-w-0 text-xs text-muted-foreground sm:mr-auto">
            {scanState === "results" &&
              missingSets.length > 0 &&
              `${selectedSetIds.size} of ${missingSets.length} selected`}
          </div>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {scanState === "results" && missingSets.length > 0 && (
            <Button onClick={() => void handleImport()} disabled={selectedSetIds.size === 0}>
              Import Selected ({selectedSetIds.size})
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
