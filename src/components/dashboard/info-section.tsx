"use client";

import { useState, useMemo, CSSProperties } from "react";
import { Area, AreaChart, Pie, PieChart, XAxis } from "recharts";
import { DateRange } from "react-day-picker";
import { z } from "zod";
import { Calendar as CalendarIcon, AlertCircle, Sparkles } from "lucide-react";
import { getMetrics } from "@/actions/metrics";
import { useScreenSize } from "@/hooks/useScreenSize";
import { Transaction } from "@/types";
import { limitsFormSchema } from "@/lib/schemas";
import {
  cn,
  generatePieChartData,
  generateAreaChartData,
  generateLimitsReport,
} from "@/lib/utils";
import { expenseGroups } from "@/lib/constants";
import { WarningDialog } from "@/components/dialogs/warning-dialog";
import { AISummaryDialog } from "@/components/dialogs/ai-summary-dialog";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export const InfoSection = ({
  metrics,
  limits,
  transactions,
}: {
  metrics: Awaited<ReturnType<typeof getMetrics>>["metrics"];
  limits: z.infer<typeof limitsFormSchema> | null;
  transactions: Transaction[];
}) => {
  const { width } = useScreenSize();
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [warningDialogState, setWarningDialogState] = useState<{
    open: boolean;
  }>({ open: false });
  const [aiSummaryDialogState, setAISummaryDialogState] = useState<{
    open: boolean;
  }>({
    open: false,
  });

  const monthlyAvgBalance = metrics?.analytics?.monthlyAverages?.balance || 0;
  const monthlyAvgIncome = metrics?.analytics?.monthlyAverages?.income || 0;
  const monthlyAvgExpense = metrics?.analytics?.monthlyAverages?.expense || 0;
  const savingRate = metrics?.analytics?.savingsRate || 0;
  const totalIncomes = metrics?.analytics?.totalIncome || 0;
  const totalExpenses = metrics?.analytics?.totalExpense || 0;

  const areaChartConfig = {
    expenses: {
      label: "Expenses",
      color: "hsl(var(--chart-9))",
    },
    incomes: {
      label: "Incomes",
      color: "hsl(var(--chart-10))",
    },
  } satisfies ChartConfig;

  const pieChartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};

    Object.keys(expenseGroups).forEach(
      (group, index) =>
        (config[group] = {
          label: `${group.charAt(0).toUpperCase()}${group.slice(1)}`,
          color: `hsl(var(--chart-${index + 1}))`,
        })
    );

    return config;
  }, []) satisfies ChartConfig;

  const pieChartData = useMemo(
    () => generatePieChartData({ metrics, date }),
    [metrics, date]
  );

  const areaChartData = useMemo(
    () => generateAreaChartData({ metrics, date }),
    [metrics, date]
  );

  const limitsReport = useMemo(
    () => generateLimitsReport({ metrics, limits }),
    [metrics, limits]
  );

  return (
    <div className="flex h-[1200px] w-full flex-col justify-start gap-4 md:h-[900px] lg:h-[500px]">
      <div className="flex h-max w-full flex-wrap items-center justify-end gap-4">
        {limitsReport.length ? (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setWarningDialogState({ open: true })}
          >
            <AlertCircle className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        ) : null}
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2"
          onClick={() => setAISummaryDialogState({ open: true })}
        >
          <Sparkles className="h-[1.2rem] w-[1.2rem]" />
          <span>AI Summary</span>
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
              variant="outline"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>
                {date?.from ? (
                  date.to ? (
                    <>
                      {new Date(date.from).toLocaleDateString("tr-TR")} -{" "}
                      {new Date(date.to).toLocaleDateString("tr-TR")}
                    </>
                  ) : (
                    new Date(date.from).toLocaleDateString("tr-TR")
                  )
                ) : (
                  <span>Filter Chart Data</span>
                )}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar
              defaultMonth={date?.from}
              initialFocus
              mode="range"
              numberOfMonths={width > 768 ? 2 : 1}
              onSelect={setDate}
              selected={date}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full flex-1 overflow-auto">
        <div className="flex h-full w-full flex-col items-start justify-start gap-4 lg:flex-row">
          <div className="h-full w-full flex-[0.4]">
            <div className="flex h-full w-full flex-col items-start justify-start gap-4 rounded-md border border-border bg-muted/50 p-4">
              <div className="w-max space-y-1">
                <h3 className="text-base font-bold leading-tight md:text-lg">
                  Current Balance
                </h3>
                <h4 className="w-max text-sm md:text-base">
                  {metrics?.balance.toLocaleString("tr-TR") || 0} $
                </h4>
              </div>
              <div className="w-max space-y-1">
                <h3 className="text-base font-bold leading-tight md:text-lg">
                  Monthly Averages
                </h3>
                <div className="flex w-full items-center justify-start gap-6 text-sm md:text-base">
                  <div className="space-y-1">
                    <h5>Income</h5>
                    <h6 className="text-xs sm:text-sm">
                      {monthlyAvgIncome.toLocaleString("tr-TR")} $
                    </h6>
                  </div>
                  <div className="space-y-1">
                    <h5>Expense</h5>
                    <h6 className="text-xs sm:text-sm">
                      {monthlyAvgExpense.toLocaleString("tr-TR")} $
                    </h6>
                  </div>
                  <div className="space-y-1">
                    <h5>Balance</h5>
                    <h6 className="text-xs sm:text-sm">
                      {monthlyAvgBalance.toLocaleString("tr-TR")} $
                    </h6>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-1">
                <h3 className="text-base font-bold leading-tight md:text-lg">
                  Saving Rate
                </h3>
                <h4 className="text-sm md:text-base">
                  {savingRate.toLocaleString("tr-TR") || 0} %
                </h4>
              </div>
              <div className="w-full space-y-1">
                <h3 className="text-base font-bold leading-tight md:text-lg">
                  Totals
                </h3>
                <div className="flex w-full items-center justify-start gap-6 text-sm md:text-base">
                  <div className="space-y-1">
                    <h5>Incomes</h5>
                    <h6 className="text-xs sm:text-sm">
                      {totalIncomes.toLocaleString("tr-TR")} $
                    </h6>
                  </div>
                  <div className="space-y-1">
                    <h5>Expenses</h5>
                    <h6 className="text-xs sm:text-sm">
                      {totalExpenses.toLocaleString("tr-TR")} $
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-full w-full flex-1 flex-col items-start justify-start gap-4 overflow-auto md:flex-row lg:w-auto">
            <div className="h-full w-full flex-1 overflow-auto">
              {pieChartData.length ? (
                <ChartContainer
                  config={pieChartConfig}
                  className="h-full w-full rounded-md border border-border bg-muted/50"
                >
                  <PieChart accessibilityLayer>
                    <Pie
                      data={pieChartData}
                      dataKey="totalAmount"
                      nameKey="group"
                      fillOpacity={0.4}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideLabel
                          formatter={(value, name) => (
                            <div className="h-max-w-max flex items-center justify-start gap-2">
                              <div
                                className="max-h-2 min-h-2 min-w-2 max-w-2 rounded-full bg-[--color-bg]"
                                style={
                                  {
                                    "--color-bg": `var(--color-${name})`,
                                  } as CSSProperties
                                }
                              ></div>
                              <span className="capitalize">{name}</span>
                              <span className="font-bold">
                                {value.toLocaleString("tr-TR")} $
                              </span>
                            </div>
                          )}
                        />
                      }
                    />
                    <ChartLegend
                      content={<ChartLegendContent nameKey="group" />}
                      className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                    />
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="roundedded-md flex h-full w-full items-center justify-center border border-border">
                  <span className="max-w-[80vw] text-center">
                    No data found for expenses pie chart.
                  </span>
                </div>
              )}
            </div>
            <div className="h-full w-full flex-1 overflow-auto">
              {areaChartData?.length ? (
                <ChartContainer
                  config={areaChartConfig}
                  className="h-full w-full rounded-md border border-border bg-muted/50 p-4"
                >
                  <AreaChart accessibilityLayer data={areaChartData || []}>
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={0}
                    />
                    <Area
                      dataKey="incomes"
                      fill="var(--color-incomes)"
                      type="natural"
                      fillOpacity={0.4}
                      stroke="var(--color-incomes)"
                    />
                    <Area
                      dataKey="expenses"
                      fill="var(--color-expenses)"
                      type="natural"
                      fillOpacity={0.4}
                      stroke="var(--color-expenses)"
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideLabel
                          formatter={(value, name, payload, index) => (
                            <div className="space-y-2">
                              {index === 0 ? (
                                <span className="font-bold">
                                  {payload.payload.date}
                                </span>
                              ) : null}
                              <div className="h-max-w-max flex items-center justify-start gap-2">
                                <div
                                  className="max-h-2 min-h-2 min-w-2 max-w-2 rounded-full bg-[--color-bg]"
                                  style={
                                    {
                                      "--color-bg": `var(--color-${name})`,
                                    } as CSSProperties
                                  }
                                ></div>
                                <span className="capitalize">{name}</span>
                                <span className="font-bold">
                                  {value.toLocaleString("tr-TR")} $
                                </span>
                              </div>
                            </div>
                          )}
                        />
                      }
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-md border border-border">
                  <span className="max-w-[80vw] text-center">
                    No data found for expenses/incomes bar chart.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <WarningDialog
        {...{
          open: warningDialogState.open,
          onOpenChange: () => setWarningDialogState({ open: false }),
          exceededLimits: limitsReport,
        }}
      />
      <AISummaryDialog
        {...{
          open: aiSummaryDialogState.open,
          onOpenChange: () => setAISummaryDialogState({ open: false }),
          metrics,
          limitsReport,
          transactions,
        }}
      />
    </div>
  );
};
