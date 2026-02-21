import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { colors, spacing, typography, iconSizes } from '../theme';

const Drawer = createDrawerNavigator();

export type DrawerParamList = {
  Home: undefined;
  Exams: undefined;
  Settings: undefined;
};

type DrawerLayoutProps = {
  HomeScreen: React.ComponentType<any>;
  ExamsScreen: React.ComponentType<any>;
  SettingsScreen: React.ComponentType<any>;
  DrawerContent: React.ComponentType<any>;
};

export function createDrawerLayout({
  HomeScreen,
  ExamsScreen,
  SettingsScreen,
  DrawerContent,
}: DrawerLayoutProps) {
  return function DrawerLayout() {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: typography.subtitle,
          drawerStyle: { backgroundColor: colors.surface },
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.textSecondary,
          drawerLabelStyle: typography.body,
        }}
        drawerContent={(props) => <DrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Exams" component={ExamsScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    );
  };
}
