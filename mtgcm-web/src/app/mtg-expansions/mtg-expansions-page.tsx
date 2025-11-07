import { useEffect, useState } from "react";
import { useAxios } from "../../hooks/use-axios.ts";
import { DataTable } from "../../components/ui/data-table.tsx";
import { columns } from "./mtg-expansions-cols.tsx";

export function MtgExpansionsPage() {
  const axios = useAxios();
  const [sets, setSets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/collection/sets");
      setSets(response.data);
    };
    fetchData();
  }, []);
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={sets} />
    </div>
  );
}
