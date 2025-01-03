import {Card, CardDescription, CardFooter, CardHeader, CardTitle,} from "../../../shared/components/card/Card";
import {Progress} from "../../../shared/components/progress/Progress";

const SetProgress = ({ set }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{set?.name} collection progress</CardDescription>
        <CardTitle className="text-4xl">
          {set?.ownedCards} cards of {set?.totalCards}
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <Progress
          value={set?.ownedCards / set?.totalCards}
          aria-label={`${(set?.ownedCards / set?.totalCards) * 100}% collected`}
        />
      </CardFooter>
    </Card>
  );
};

export default SetProgress;
