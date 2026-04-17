import type { Card, CardSet } from "@/lib/data";

const SETS_ENDPOINT = "http://localhost:8080/sets";
const MISSING_SETS_ENDPOINT = "http://localhost:8080/missing-sets";
const SCRYFALL_SYMBOLOGY_ENDPOINT = "https://api.scryfall.com/symbology";
const LOAD_COLLECTIONS_ENDPOINT = "http://localhost:8080/load-collections";

export interface ManaSymbol {
  symbol: string;
  svg_uri: string;
}

export interface LoadCollectionsResult {
  setCode: string;
  success: boolean;
  timeTaken: number;
}

export async function fetchSets(): Promise<CardSet[]> {
  const response = await fetch(SETS_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Failed to fetch sets: ${response.status} ${response.statusText}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid sets response: expected an array");
  }

  return data as CardSet[];
}

export async function fetchMissingSets(): Promise<CardSet[]> {
  const response = await fetch(MISSING_SETS_ENDPOINT);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch missing sets: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid missing sets response: expected an array");
  }

  return data as CardSet[];
}

export async function fetchSetCards(setCode: string): Promise<Card[]> {
  const response = await fetch(`http://localhost:8080/sets/${setCode}/cards`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch cards for set ${setCode}: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid cards response: expected an array");
  }

  return data as Card[];
}

export async function updateCardCollected(
  setCode: string,
  cardId: string,
  collected: boolean,
): Promise<Card> {
  const response = await fetch(
    `http://localhost:8080/sets/${setCode}/cards/${cardId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ collected }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to update card ${cardId} in set ${setCode}: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();

  if (typeof data !== "object" || data === null || !("id" in data)) {
    throw new Error("Invalid card update response: expected a card object");
  }

  return data as Card;
}

export async function fetchManaSymbols(): Promise<Record<string, string>> {
  const response = await fetch(SCRYFALL_SYMBOLOGY_ENDPOINT);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch mana symbols: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("data" in data) ||
    !Array.isArray(data.data)
  ) {
    throw new Error("Invalid symbology response: expected a data array");
  }

  return (data.data as ManaSymbol[]).reduce<Record<string, string>>(
    (symbolsByToken, symbol) => {
      if (symbol.symbol && symbol.svg_uri) {
        symbolsByToken[symbol.symbol] = symbol.svg_uri;
      }
      return symbolsByToken;
    },
    {},
  );
}

export async function loadCollections(
  setIds: string[],
): Promise<LoadCollectionsResult[]> {
  const response = await fetch(LOAD_COLLECTIONS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(setIds),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to import sets: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid import response: expected an array");
  }

  return data as LoadCollectionsResult[];
}
