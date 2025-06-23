"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, BarChart as BarChartIcon } from "lucide-react";

export interface ChartPlaceholderCardProps {
  chartType?: "bar" | "line" | "pie" | "table";
  chartDescription?: string;
  detailedInformation?: string;
  chartDataJson?: string;
}

const COLORS = ["#29ABE2", "#29E2D2", "#8884d8", "#a3e635", "#fde047"];

const CustomTable = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return null;
  const headers = Object.keys(data[0]);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className="capitalize">
                {header.replace(/_/g, " ")}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header) => (
                <TableCell key={`${rowIndex}-${header}`}>{row[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const ChartPlaceholderCard: React.FC<ChartPlaceholderCardProps> = ({
  chartType,
  chartDescription,
  chartDataJson,
  detailedInformation,
}) => {
  let data;
  try {
    if (chartDataJson) {
      data = JSON.parse(chartDataJson);
    }
  } catch (error) {
    console.error("Error parsing chartDataJson:", error);
    return (
      <Card className="my-6 border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Chart Data Error
          </CardTitle>
          <CardDescription className="text-destructive/80">
            There was an error parsing the data for this chart.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    // Don't render anything if there's no data
    return null;
  }

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <RechartsTooltip wrapperClassName="!bg-background !border-border !rounded-md" />
              <Legend />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip wrapperClassName="!bg-background !border-border !rounded-md" />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }}/>
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="hsl(var(--primary))" label>
                {data.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip wrapperClassName="!bg-background !border-border !rounded-md" />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case "table":
        return <CustomTable data={data} />;
      default:
        return (
            <p className="text-sm text-muted-foreground">Chart type '{chartType}' is not supported. Displaying as table.</p>
        );
    }
  };

  return (
    <Card className="my-4 md:my-6 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center text-lg md:text-xl font-headline">
            <BarChartIcon className="mr-2 h-5 w-5 text-primary" />
            {chartDescription || "Data Visualization"}
        </CardTitle>
        {detailedInformation && (
            <CardDescription className="text-xs md:text-sm">{detailedInformation}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};
