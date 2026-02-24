import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { OnboardingScreen } from './src/screens/onboarding/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ExamsScreen } from './src/screens/ExamsScreen';
import { ImportScreen } from './src/screens/ImportScreen';
import { DiscoveryScreen } from './src/screens/DiscoveryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { DrawerContent } from './src/navigation/DrawerContent';
import { colors, typography, iconSizes } from './src/theme';
import { House, PlusCircle, Compass, Gear } from 'phosphor-react-native';
import { setAuthToken } from './src/api/client';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function ExamsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ExamsList">
        {({ navigation }) => (
          <ExamsScreen onAddPress={() => navigation.navigate('Import')} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Import">
        {({ navigation }) => (
          <ImportScreen onDone={() => navigation.goBack()} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: typography.caption,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <House size={size ?? iconSizes.navigation} color={color} weight="regular" />
          ),
        }}
      />
      <Tab.Screen
        name="Exams"
        component={ExamsStack}
        options={{
          title: 'Exams',
          tabBarLabel: 'Exams',
          tabBarIcon: ({ color, size }) => (
            <PlusCircle size={size ?? iconSizes.navigation} color={color} weight="regular" />
          ),
        }}
      />
      <Tab.Screen
        name="Discovery"
        component={DiscoveryScreen}
        options={{
          title: 'Discovery',
          tabBarLabel: 'Discovery',
          tabBarIcon: ({ color, size }) => (
            <Compass size={size ?? iconSizes.navigation} color={color} weight="regular" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainDrawer({ onLogout }: { onLogout: () => void }) {
  const [displayName] = React.useState<string | null>('Test User');

  const CustomDrawerContent = React.useCallback(
    (drawerProps: DrawerContentComponentProps) => (
      <DrawerContent
        {...drawerProps}
        userDisplayName={displayName}
        userEmail={null}
        memberSince="January 2024"
        onEditProfile={() => {}}
        onLogout={onLogout}
      />
    ),
    [displayName, onLogout]
  );

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
      drawerContent={CustomDrawerContent}
    >
      <Drawer.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          title: 'Dra Lia',
          drawerItemStyle: { height: 0, margin: 0, padding: 0, display: 'none' },
        }}
      />
      <Drawer.Screen
        name="Settings"
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Gear size={size ?? iconSizes.navigation} color={color} weight="regular" />
          ),
        }}
      >
        {() => (
          <SettingsScreen
            userDisplayName={displayName}
            onEditProfile={() => {}}
            onLogout={onLogout}
          />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleOnboardingComplete = React.useCallback(() => {
    setAuthToken('dev-token');
    setHasCompletedOnboarding(true);
    setIsLoggedIn(true);
  }, []);

  const handleLogout = React.useCallback(() => {
    setAuthToken(null);
    setIsLoggedIn(false);
    setHasCompletedOnboarding(false);
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding">
            {(props) => (
              <OnboardingScreen
                {...props}
                onComplete={handleOnboardingComplete}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main">
            {() => <MainDrawer onLogout={handleLogout} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
