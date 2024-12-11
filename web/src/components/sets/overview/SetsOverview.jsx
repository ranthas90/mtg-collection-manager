import { useEffect, useRef, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../shared/components/tabs/Tabs";
import { Search } from "lucide-react";
import { Input } from "../../../shared/components/input/Input";
import BreadcrumbHeader from "../../../shared/components/breadcrumb/BreadcrumbHeader";
import SetsOverviewTabsContent from "./SetsOverviewTabsContent";
import SearchInput from "../../../shared/components/input/SearchInput";

const SetsOverview = () => {
  const axios = useAxios();
  const [sets, setSets] = useState([]);
  const setsRef = useRef([]);

  const breadcrumItems = [{ title: "Collection sets", link: "/sets" }];

  const filterSetsHandler = (changeEvent) => {
    setSets(
      setsRef.current.filter(
        (set) =>
          set.name
            .toLowerCase()
            .includes(changeEvent.target.value.toLowerCase()) ||
          set.setType
            .toLowerCase()
            .includes(changeEvent.target.value.toLowerCase())
      )
    );
  };

  const filterSetsByYearRange = (yearRange) => {
    return sets.filter((set) => set.releasedAt.includes(yearRange));
  };

  const tabs = [
    {
      value: "all",
      title: "All",
      description:
        "Magic The Gathering &#8482; all collection sets since 1993.",
      sets: sets,
    },
    {
      value: "a1",
      title: "1993 - 1999",
      description:
        "Magic The Gathering &8482; all collection sets since 1993 to 1999.",
      sets: filterSetsByYearRange("199"),
    },
    {
      value: "a2",
      title: "2000 - 2009",
      description:
        "Magic The Gathering &8482; all collection sets since 2000 to 2009.",
      sets: filterSetsByYearRange("200"),
    },
    {
      value: "a3",
      title: "2010 - 2019",
      description:
        "Magic The Gathering &8482; all collection sets since 2010 to 2019.",
      sets: filterSetsByYearRange("201"),
    },
    {
      value: "a4",
      title: "2020 - 2029",
      description:
        "Magic The Gathering &8482; all collection sets since 2020 to 2029.",
      sets: filterSetsByYearRange("202"),
    },
  ];

  useEffect(() => {
    axios.get("/sets").then((response) => {
      setSets(response.data);
      setsRef.current = response.data;
    });
  }, []);

  return (
    <>
      <BreadcrumbHeader items={breadcrumItems} />
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <SearchInput
              onChangeHandler={filterSetsHandler}
              placeholder="Search by set name or type"
            />
          </div>
        </div>
        {tabs.map((tab) => (
          <SetsOverviewTabsContent
            key={`tab_${tab.value}`}
            value={tab.value}
            description={tab.description}
            sets={tab.sets}
          />
        ))}
      </Tabs>
    </>
  );
};

export default SetsOverview;
