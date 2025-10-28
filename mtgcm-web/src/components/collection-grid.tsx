import { useEffect, useRef, useState } from "react";
import { CollectionCard } from "@/components/collection-card.tsx";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { useAxios } from "@/hooks/use-axios.ts";

const ITEMS_PER_PAGE = 9;

export function CollectionGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const axios = useAxios();
  const [collections, setCollections] = useState([]);

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const displayedCollections = filteredCollections.slice(0, displayedCount);
  const hasMore = displayedCount < filteredCollections.length;

  useEffect(() => {
    // fetch collection sets from axios
  }, []);

  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          // Simulate loading delay
          setTimeout(() => {
            setDisplayedCount((prev) => prev + ITEMS_PER_PAGE);
            setIsLoading(false);
          }, 500);
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Found {filteredCollections.length}{" "}
          {filteredCollections.length === 1 ? "collection" : "collections"}
        </p>
      )}

      {displayedCollections.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>

          {hasMore && (
            <div ref={observerTarget} className="flex justify-center py-8">
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Loading more collections...</span>
                </div>
              )}
            </div>
          )}

          {!hasMore && filteredCollections.length > ITEMS_PER_PAGE && (
            <p className="text-center text-sm text-muted-foreground py-4">
              All collections loaded
            </p>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No collections found matching "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
