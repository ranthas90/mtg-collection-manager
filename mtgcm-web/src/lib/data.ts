export interface CardSet {
    id: string;
    name: string;
    type: string;
    releaseDate: string;
    totalCards: number;
    collectedCards: number;
    iconUri?: string;
}

export interface Card {
    id: string;
    collectionNumber: string;
    name: string;
    type: string;
    rarity:
        | "common"
        | "uncommon"
        | "rare"
        | "mythic";
    manaCost: string;
    price?: number;
    regularPrice?: number | null;
    foilPrice?: number | null;
    collected: boolean;
    imageUriNormal?: string;
    imageUriArtCrop?: string;
    oracleText?: string;
    artist?: string;
    power?: string;
    toughness?: string;
    setName?: string;
    setCode?: string;
}
