import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Laptop, AlertTriangle } from "lucide-react";

interface ProductivityInsightsProps {
  mostProductiveHour: string;
  topApps: { name: string; minutes: number }[];
  distractions: number;
}

export const ProductivityInsights = ({
  mostProductiveHour,
  topApps,
  distractions,
}: ProductivityInsightsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Most Productive Hours</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mostProductiveHour}</div>
          <p className="mt-1 text-sm text-muted-foreground">Peak focus time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Laptop className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Top Apps</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topApps.slice(0, 3).map((app, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="font-medium">{app.name}</span>
                <span className="text-muted-foreground">{(app.minutes / 60).toFixed(1)}h</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <CardTitle className="text-base">Distractions Detected</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{distractions}</div>
          <p className="mt-1 text-sm text-muted-foreground">Context switches today</p>
        </CardContent>
      </Card>
    </div>
  );
};
