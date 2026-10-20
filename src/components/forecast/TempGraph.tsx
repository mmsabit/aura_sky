import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  createHorizontalChart,
} from "recharts";

export type TemperaturePoint = {
  label: string;
  temperature: number;
  apparent: number;
};

export type TemperatureMetric = "temperature" | "apparent";

const SERIES: Record<TemperatureMetric, { name: string; color: string }> = {
  temperature: { name: "Temperature", color: "#006194" },
  apparent: { name: "Feels like", color: "#40c2fd" },
};

const Typed = createHorizontalChart<TemperaturePoint, string, number>()({
  XAxis,
  YAxis,
  Tooltip,
  Line,
});

type TempGraphProps = {
  data: TemperaturePoint[];
  metric: TemperatureMetric;
};

const TempGraph = ({ data, metric }: TempGraphProps) => {
  const series = SERIES[metric];

  return (
    <Typed.LineChart
      style={{
        width: "100%",
        height: "100%",
        maxHeight: "70vh",
        aspectRatio: 2.4,
      }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 12,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid stroke="#e2e7ff" strokeDasharray="4 4" vertical={false} />
      <Typed.XAxis
        dataKey="label"
        tickLine={false}
        axisLine={false}
        minTickGap={24}
        tick={{ fontSize: 11, fill: "#707881" }}
      />
      <Typed.YAxis
        width="auto"
        domain={["dataMin - 2", "dataMax + 2"]}
        tickLine={false}
        axisLine={false}
        tick={{ fontSize: 11, fill: "#707881" }}
        tickFormatter={(value) => `${Math.round(Number(value))}°`}
      />
      <Tooltip
        cursor={{ stroke: "#bfc7d2", strokeDasharray: "3 3" }}
        contentStyle={{
          borderRadius: 12,
          border: "1px solid #e2e7ff",
          fontSize: 12,
        }}
      />
      <Typed.Line
        type="monotone"
        dataKey={metric}
        name={series.name}
        stroke={series.color}
        strokeWidth={2.5}
        dot={{ r: 3, strokeWidth: 0, fill: series.color }}
        activeDot={{ r: 5 }}
        unit="°C"
        connectNulls
      />
    </Typed.LineChart>
  );
};

export default TempGraph;
