import React from 'react';
import { Switch as RNSwitch } from 'react-native';
import { colors } from '../theme';

type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

export function Switch({ value, onValueChange, disabled }: SwitchProps) {
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: colors.border,
        true: colors.primarySoft,
      }}
      thumbColor={value ? colors.primary : colors.surface}
      ios_backgroundColor={colors.border}
    />
  );
}
