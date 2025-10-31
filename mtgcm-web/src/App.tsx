import { ThemeToggle } from "./components/theme-toggle";
import { CollectionGrid } from "./components/collection-grid";

function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-balance">MTG Collection</h1>
            <p className="text-sm text-muted-foreground">
              Browse Magic: The Gathering card sets
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-balance">
            Explore Collections
          </h2>
          <p className="text-muted-foreground text-pretty leading-relaxed">
            Discover cards from different Magic: The Gathering sets and
            expansions throughout the years.
          </p>
        </div>

        <CollectionGrid />
      </main>
    </div>
  );
}

export default App;
