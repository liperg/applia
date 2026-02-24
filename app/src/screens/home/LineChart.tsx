import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors } from '../../theme';
import type { ChartDataPoint } from './types';
import { buildDataRanges, createAreaPath, createPath } from './chartUtils';

const CHART_HEIGHT = 120;

type LineChartProps = {
  data: readonly ChartDataPoint[];
  height?: number;
};

export function LineChart({ data, height = CHART_HEIGHT }: LineChartProps) {
  const [width, setWidth] = useState(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  }, []);

  const ranges = useMemo(() => buildDataRanges(data), [data]);
  const linePath = useMemo(
    () => (width > 0 ? createPath(data, width, height, ranges) : ''),
    [data, width, height, ranges],
  );
  const areaPath = useMemo(
    () => (width > 0 ? createAreaPath(data, width, height, ranges) : ''),
    [data, width, height, ranges],
  );

  if (data.length === 0) return <View style={[styles.container, { height }]} />;

  return (
    <View style={[styles.container, { height }]} onLayout={onLayout}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.25" />
            <Stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path d={areaPath} fill="url(#chartGradient)" />
        <Path
          d={linePath}
          stroke={colors.primary}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
