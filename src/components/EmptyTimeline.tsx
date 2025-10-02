import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export const EmptyTimeline = () => {
  return (
    <Card className="shadow-card border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Clock className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No activities captured yet
        </h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Make sure ActivityWatch is running and tracking your time. Activities will appear here automatically.
        </p>
        <Link to="/settings">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Go to Settings
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
