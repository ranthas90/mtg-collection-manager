import { useEffect, useState } from "react";
import { useAxios } from "../../hooks/use-axios.ts";

export function MtgExpansionsPage() {
  const axios = useAxios();
  const [sets, setSets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get("/collection/sets");
    };
    fetchData();
  }, []);
  return <div>My ExpansionsPage</div>;
}
