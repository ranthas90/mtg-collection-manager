import { Badge } from "@/components/ui/badge.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Calendar, Layers } from "lucide-react";
import { Progress } from "@/components/ui/progress.tsx";

interface Collection {
  id: string;
  name: string;
  releaseDate: string;
  cardCount: number;
  ownedCards: number;
  description: string;
  imageQuery: string;
}

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const completionPercentage = Math.round(
    (collection.ownedCards / collection.cardCount) * 100,
  );
  const isComplete = completionPercentage === 100;

  return (
    <Card className="group overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={`/.jpg?height=400&width=600&query=${encodeURIComponent(collection.imageQuery)}`}
          alt={collection.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
        {isComplete ? (
          <Badge className="absolute top-3 right-3 bg-green-600 text-white">
            Complete
          </Badge>
        ) : (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
            {completionPercentage}%
          </Badge>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors text-balance">
          {collection.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed text-pretty">
          {collection.description}
        </p>

        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Collection Progress</span>
            <span className="font-medium text-foreground">
              {collection.ownedCards} / {collection.cardCount}
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{collection.releaseDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>{collection.cardCount} cards</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
