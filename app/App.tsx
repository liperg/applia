import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { OnboardingSignUpScreen } from './src/screens/onboarding/OnboardingSignUpScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ExamsScreen } from './src/screens/ExamsScreen';
import { ImportScreen } from './src/screens/ImportScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { DrawerContent } from './src/navigation/DrawerContent';
import { colors, typography, iconSizes } from './src/theme';
import { House, FileText, Gear } from 'phosphor-react-native';
import { setAuthToken } from './src/api/client';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function ExamsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.textPrimary }}>
      <Stack.Screen name="ExamsList" options={{ title: 'Exams' }}>
        {({ navigation }) => (
          <ExamsScreen onAddPress={() => navigation.navigate('Import')} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Import" options={{ title: 'Import PDF' }}>
        {({ navigation }) => (
          <ImportScreen onDone={() => navigation.goBack()} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function MainDrawer({ onLogout }: { onLogout: () => void }) {
  const [displayName] = React.useState<string | null>('Test User');

  const CustomDrawerContent = React.useCallback(
    (drawerProps: any) => (
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
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => <House size={size ?? iconSizes.navigation} color={color} weight="regular" />,
        }}
      />
      <Drawer.Screen
        name="Exams"
        component={ExamsStack}
        options={{
          drawerIcon: ({ color, size }) => <FileText size={size ?? iconSizes.navigation} color={color} weight="regular" />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        options={{
          drawerIcon: ({ color, size }) => <Gear size={size ?? iconSizes.navigation} color={color} weight="regular" />,
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
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleSignIn = React.useCallback(() => {
    setAuthToken('dev-token');
    setIsLoggedIn(true);
  }, []);

  const handleLogout = React.useCallback(() => {
    setAuthToken(null);
    setIsLoggedIn(false);
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="OnboardingSignUp">
            {() => (
              <OnboardingSignUpScreen
                onContinueWithPhone={() => handleSignIn()}
                onContinueWithGoogle={handleSignIn}
                onContinueWithApple={handleSignIn}
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
