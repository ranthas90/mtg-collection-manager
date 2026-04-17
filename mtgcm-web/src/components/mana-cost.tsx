import { useQuery } from "@tanstack/react-query";
import { fetchManaSymbols } from "@/lib/api";

interface ManaCostProps {
  manaCost: string;
  className?: string;
  iconClassName?: string;
}

const MANA_SYMBOL_PATTERN = /\{[^}]+\}/g;

function splitManaCost(manaCost: string): string[] {
  return manaCost.match(MANA_SYMBOL_PATTERN) ?? [];
}

export function ManaCost({
  manaCost,
  className,
  iconClassName = "size-4",
}: ManaCostProps) {
  const { data: symbolsByToken } = useQuery({
    queryKey: ["scryfall", "symbology"],
    queryFn: fetchManaSymbols,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  if (!manaCost) {
    return <span className={className}>-</span>;
  }

  const symbols = splitManaCost(manaCost);

  if (symbols.length === 0) {
    return <span className={className}>{manaCost}</span>;
  }

  return (
    <span className={className}>
      <span className="inline-flex flex-wrap items-center gap-0.5 align-middle">
        {symbols.map((symbol, index) => {
          const symbolUri = symbolsByToken?.[symbol];

          if (!symbolUri) {
            return (
              <span key={`${symbol}-${index}`} className="font-mono text-inherit">
                {symbol}
              </span>
            );
          }

          return (
            <img
              key={`${symbol}-${index}`}
              src={symbolUri}
              alt={symbol}
              title={symbol}
              className={iconClassName}
            />
          );
        })}
      </span>
    </span>
  );
}
