// TODO: mantenemos este fichero hasta que enganchemos correctamente al backend
import type { CardSet, Card } from "./data";

// Scryfall API types
interface ScryfallSet {
  id: string;
  code: string;
  name: string;
  set_type: string;
  released_at: string;
  card_count: number;
  icon_svg_uri: string;
}

interface ScryfallSetsResponse {
  object: string;
  has_more: boolean;
  data: ScryfallSet[];
}

interface ScryfallCard {
  id: string;
  name: string;
  collector_number: string;
  type_line: string;
  rarity: string;
  mana_cost?: string;
  oracle_text?: string;
  artist?: string;
  power?: string;
  toughness?: string;
  set_name?: string;
  set?: string;
  prices: {
    usd?: string;
    usd_foil?: string;
  };
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
    png?: string;
  };
  card_faces?: Array<{
    image_uris?: {
      small?: string;
      normal?: string;
      large?: string;
      png?: string;
    };
  }>;
}

interface ScryfallCardsResponse {
  object: string;
  total_cards: number;
  has_more: boolean;
  next_page?: string;
  data: ScryfallCard[];
}

// Set types we care about for collection
const RELEVANT_SET_TYPES = [
  "core",
  "expansion",
  "masters",
  "commander",
  "draft_innovation",
];

// Map Scryfall set type to our display type
function mapSetType(scryfallType: string): string {
  const typeMap: Record<string, string> = {
    core: "Core Set",
    expansion: "Expansion",
    masters: "Masters",
    commander: "Commander",
    draft_innovation: "Draft Innovation",
  };
  return typeMap[scryfallType] || scryfallType;
}

// Map Scryfall rarity to our rarity type
function mapRarity(scryfallRarity: string): Card["rarity"] {
  const rarityMap: Record<string, Card["rarity"]> = {
    common: "Common",
    uncommon: "Uncommon",
    rare: "Rare",
    mythic: "Mythic Rare",
  };
  return rarityMap[scryfallRarity] || "Common";
}

export async function fetchScryfallSets(): Promise<CardSet[]> {
  const response = await fetch("https://api.scryfall.com/sets");
  if (!response.ok) {
    throw new Error("Failed to fetch sets from Scryfall");
  }

  const data: ScryfallSetsResponse = await response.json();

  return data.data
    .filter((set) => RELEVANT_SET_TYPES.includes(set.set_type))
    .map((set) => ({
      id: set.code,
      name: set.name,
      type: mapSetType(set.set_type),
      releaseDate: set.released_at,
      totalCards: set.card_count,
      collectedCards: 0,
      iconUri: set.icon_svg_uri,
    }));
}

export async function fetchSetCards(setCode: string): Promise<Card[]> {
  const cards: Card[] = [];
  let url: string | null =
    `https://api.scryfall.com/cards/search?order=set&q=set:${setCode}`;

  while (url) {
    const response = await fetch(url);
    if (!response.ok) {
      // No cards found for this set
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to fetch cards for set ${setCode}`);
    }

    const data: ScryfallCardsResponse = await response.json();

    for (const card of data.data) {
      // Get image URI - handle double-faced cards
      const imageUri =
        card.image_uris?.normal ||
        card.card_faces?.[0]?.image_uris?.normal ||
        undefined;

      cards.push({
        id: `${setCode}-${card.collector_number}`,
        sortNumber: parseInt(card.collector_number) || cards.length + 1,
        name: card.name,
        type: card.type_line,
        rarity: mapRarity(card.rarity),
        manaCost: card.mana_cost || "",
        price: parseFloat(card.prices.usd || "0"),
        collected: false,
        imageUri,
        oracleText: card.oracle_text,
        artist: card.artist,
        power: card.power,
        toughness: card.toughness,
        setName: card.set_name,
        setCode: card.set,
      });
    }

    url = data.has_more ? data.next_page || null : null;

    // Respect Scryfall rate limits (100ms between requests)
    if (url) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return cards.sort((a, b) => a.sortNumber - b.sortNumber);
}

export function findMissingSets(
  scryfallSets: CardSet[],
  existingSets: CardSet[],
): CardSet[] {
  const existingIds = new Set(existingSets.map((s) => s.id.toLowerCase()));
  return scryfallSets.filter((set) => !existingIds.has(set.id.toLowerCase()));
}
