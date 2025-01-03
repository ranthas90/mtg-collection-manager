import {useParams} from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import {useEffect, useRef, useState} from "react";
import BreadcrumbHeader from "../../../shared/components/breadcrumb/BreadcrumbHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../shared/components/card/Card";
import {Progress} from "../../../shared/components/progress/Progress";
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "../../../shared/components/tabs/Tabs";
import SetCardsTable from "./SetCardsTable";
import SearchInput from "../../../shared/components/input/SearchInput";
import SetProgress from "./SetProgress";

const SetDetail = () => {
  const { id } = useParams();
  const axios = useAxios();
  const [set, setSet] = useState();
  const [cards, setCards] = useState([]);
  const cardsRef = useRef([]);

  const breadcrumbItems = [
    { title: "Collection sets", link: "/sets" },
    { title: set?.name },
  ];

  const filterSetCardsHandler = (changeEvent) => {
    setCards(
      cardsRef.current.filter((card) =>
        card.name.toLowerCase().includes(changeEvent.target.value.toLowerCase())
      )
    );
  };

  useEffect(() => {
    axios.get(`/sets/${id}`).then((response) => setSet(response.data));
    axios.get(`/sets/${id}/cards`).then((response) => {
      setCards(response.data);
      cardsRef.current = response.data;
    });
  }, [id]);

  return (
    <>
      <BreadcrumbHeader items={breadcrumbItems} />
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2 flex flex-row items-center">
            <img
              className="ml-4 py-4"
              src={set?.iconPath}
              height={128}
              width={128}
            />
            <CardHeader className="pb-3">
              <CardTitle>
                {set?.name} - ({set?.code})
              </CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                {set?.name} set is a {set?.setType} set type and it was released
                at {set?.releasedAt} with {set?.totalCards} total different
                cards.
              </CardDescription>
            </CardHeader>
          </Card>
          <SetProgress set={set} />
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-4xl">$5,329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +10% from last month
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={12} aria-label="12% increase" />
            </CardFooter>
          </Card>
        </div>
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="common">Common</TabsTrigger>
              <TabsTrigger value="uncommon">Uncommon</TabsTrigger>
              <TabsTrigger value="rare">Rare</TabsTrigger>
              <TabsTrigger value="mythic">Mythic</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <SearchInput
                onChangeHandler={filterSetCardsHandler}
                placeholder="Search by card name"
              />
            </div>
          </div>
          <TabsContent value="all">
            <SetCardsTable cards={cards} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SetDetail;
