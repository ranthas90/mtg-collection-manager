import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchManaSymbols } from "@/lib/api";
import { cn } from "@/lib/utils";

interface OracleTextProps {
  text: string;
  className?: string;
  iconClassName?: string;
}

const SYMBOL_PATTERN = /(\{[^}]+\})/g;

function tokenizeOracleText(text: string): string[] {
  return text.split(SYMBOL_PATTERN).filter(Boolean);
}

export function OracleText({
  text,
  className,
  iconClassName = "mx-0.5 inline-block size-[1.1em] align-[-0.2em]",
}: OracleTextProps) {
  const { data: symbolsByToken } = useQuery({
    queryKey: ["scryfall", "symbology"],
    queryFn: fetchManaSymbols,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const parts = tokenizeOracleText(text);

  return (
    <p
      className={cn(
        "break-words whitespace-pre-wrap text-sm leading-relaxed text-foreground",
        className,
      )}
    >
      {parts.map((part, index) => {
        const symbolUri = symbolsByToken?.[part];

        if (!symbolUri) {
          return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
        }

        return (
          <img
            key={`${part}-${index}`}
            src={symbolUri}
            alt={part}
            title={part}
            className={iconClassName}
          />
        );
      })}
    </p>
  );
}
