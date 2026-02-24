import type { ChartDataPoint } from './types';

export type DataRanges = {
  minValue: number;
  maxValue: number;
  valueRange: number;
  paddedMinValue: number;
  paddedValueRange: number;
  minTime: number;
  maxTime: number;
  timeRange: number;
};

function createCoordinateTransform(
  minTime: number,
  timeRange: number,
  minValue: number,
  valueRange: number,
  width: number,
  height: number,
) {
  const timeToX = (timestamp: number) =>
    ((timestamp - minTime) / timeRange) * width;
  const valueToY = (value: number) =>
    (1 - (value - minValue) / valueRange) * height;
  return { timeToX, valueToY };
}

export function buildDataRanges(data: readonly ChartDataPoint[]): DataRanges {
  if (data.length === 0) {
    return {
      minValue: 0,
      maxValue: 1,
      valueRange: 1,
      paddedMinValue: 0,
      paddedValueRange: 1,
      minTime: 0,
      maxTime: 1,
      timeRange: 1,
    };
  }
  const values = data.map((p) => p.value);
  const times = data.map((p) => p.timestamp);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;
  const padding = valueRange * 0.1;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const timeRange = maxTime - minTime || 1;
  return {
    minValue,
    maxValue,
    valueRange,
    paddedMinValue: minValue - padding,
    paddedValueRange: valueRange + padding * 2,
    minTime,
    maxTime,
    timeRange,
  };
}

export function createPath(
  points: readonly ChartDataPoint[],
  width: number,
  height: number,
  ranges: DataRanges,
): string {
  if (points.length === 0 || width <= 0 || height <= 0) return '';
  const { timeToX, valueToY } = createCoordinateTransform(
    ranges.minTime,
    ranges.timeRange,
    ranges.paddedMinValue,
    ranges.paddedValueRange,
    width,
    height,
  );
  const first = points[0];
  let path = `M ${timeToX(first.timestamp)} ${valueToY(first.value)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1] ?? curr;
    const cp1x = timeToX(prev.timestamp) + (timeToX(curr.timestamp) - timeToX(prev.timestamp)) * 0.5;
    const cp2x = timeToX(curr.timestamp) - (timeToX(next.timestamp) - timeToX(curr.timestamp)) * 0.5;
    path += ` C ${cp1x} ${valueToY(prev.value)}, ${cp2x} ${valueToY(curr.value)}, ${timeToX(curr.timestamp)} ${valueToY(curr.value)}`;
  }
  return path;
}

export function createAreaPath(
  points: readonly ChartDataPoint[],
  width: number,
  height: number,
  ranges: DataRanges,
): string {
  const linePath = createPath(points, width, height, ranges);
  if (!linePath) return '';
  const { timeToX } = createCoordinateTransform(
    ranges.minTime,
    ranges.timeRange,
    ranges.paddedMinValue,
    ranges.paddedValueRange,
    width,
    height,
  );
  const firstX = timeToX(points[0].timestamp);
  const lastX = timeToX(points[points.length - 1].timestamp);
  return `${linePath} L ${lastX} ${height} L ${firstX} ${height} Z`;
}
