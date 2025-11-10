import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useAxios } from "../../hooks/use-axios.ts";
import { DataTable } from "../../components/ui/data-table.tsx";
import { columns } from "./mtg-expansions-cols.tsx";
import { Input } from "../../components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import type { MtgExpansion } from "../../types/mtg-types.ts";

const expansionTypes = [
  { label: "Core", value: "core" },
  { label: "Expansion", value: "expansion" },
  { label: "Masters", value: "masters" },
  { label: "Eternal", value: "eternal" },
  { label: "Masterpiece", value: "masterpiece" },
  { label: "Arsenal", value: "arsenal" },
  { label: "From the vault", value: "from_the_vault" },
  { label: "Spellbook", value: "spellbook" },
  { label: "Premium deck", value: "premium_deck" },
  { label: "Duel deck", value: "duel_deck" },
  { label: "Draft innovation", value: "draft_innovation" },
  { label: "Commander", value: "commander" },
  { label: "Planechase", value: "planechase" },
  { label: "Archenemy", value: "archenemy" },
  { label: "Vanguard", value: "vanguard" },
  { label: "Funny", value: "funny" },
  { label: "Starter", value: "starter" },
  { label: "Box", value: "box" },
  { label: "Promo", value: "promo" },
  { label: "Token", value: "token" },
  { label: "Memorabilia", value: "memorabilia" },
  { label: "Minigame", value: "minigame" },
];

function MtgExpansionsPage() {
  const axios = useAxios();
  const setsRef = useRef<MtgExpansion[]>([]);
  const [sets, setSets] = useState<MtgExpansion[]>([]);

  function filterExpansionsByName(event: ChangeEvent<HTMLInputElement>): void {
    const searchTerm = event.target.value;
    const mtgExpansions = setsRef.current.filter((value) =>
      value.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setSets(mtgExpansions);
  }

  function filterExpansionsByType(searchTerm: string): void {
    const mtgExpansions = setsRef.current.filter(
      (value) => value.setType === searchTerm,
    );
    setSets(mtgExpansions);
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/collection/sets");
      setSets(response.data);
      setsRef.current = response.data;
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full p-4 min-h-screen">
      <p className="text-3xl font-semibold font-sans pb-4">
        Magic: the Gathering expansions and sets
      </p>
      <p className="text-sm font-sans pb-3">
        Search a list of all Magic: the Gathering expansions, promos and sets,
        ordered by newest to first.
      </p>
      <div className="flex flex-row w-full gap-x-2 pb-3">
        <Input
          className="w-1/2"
          type="text"
          placeholder="Filter expansion name"
          onChange={filterExpansionsByName}
        />
        <Select onValueChange={filterExpansionsByType}>
          <SelectTrigger className="w-1/2">
            <SelectValue placeholder="Expansion type" />
          </SelectTrigger>
          <SelectContent>
            {expansionTypes.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="justify-between">
        <DataTable columns={columns} data={sets} />
      </div>
    </div>
  );
}

export default MtgExpansionsPage;
