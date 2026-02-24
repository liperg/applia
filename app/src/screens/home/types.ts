/**
 * Types for Home exams dashboard (see docs/home-exams-dashboard.md).
 */

export type ChartDataPoint = {
  timestamp: number;
  value: number;
};

export type ExamHighlightItem = {
  id: string;
  type: 'document' | 'exam';
  documentId: string;
  title: string;
  subtitle?: string;
  currentValue?: string;
  referenceRange?: string;
  unit?: string;
  change?: string;
  trend: 'up' | 'down' | 'stable';
  outOfRange: boolean;
};

/** Mock chart data: aggregate "items out of range" over last 90 days for MVP. */
export function getMockChartData(totalNow: number): ChartDataPoint[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const points: ChartDataPoint[] = [];
  const base = Math.max(0, totalNow - 3);
  for (let i = 90; i >= 0; i -= 10) {
    const t = now - i * day;
    const progress = 1 - i / 90;
    const value = Math.round(base + (totalNow - base) * progress);
    points.push({ timestamp: t, value: Math.max(0, value) });
  }
  return points;
}
