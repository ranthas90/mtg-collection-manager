import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../shared/components/card/Card";
import { TabsContent } from "../../../shared/components/tabs/Tabs";
import SetsOverviewTable from "./SetsOverviewTable";

const SetsOverviewTabsContent = ({ value, description, sets }) => {
  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>
            Magic The Gathering &#8482; collection sets ({sets.length})
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <SetsOverviewTable sets={sets} />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SetsOverviewTabsContent;
