import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { OnboardingScreen } from './src/screens/onboarding/OnboardingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';
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

  const drawerContent = (props: any) => (
    <DrawerContent
      {...props}
      userDisplayName={displayName}
      onEditProfile={() => {}}
      onLogout={onLogout}
    />
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
      drawerContent={drawerContent}
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
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => <Gear size={size ?? iconSizes.navigation} color={color} weight="regular" />,
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding">
            {(props) => (
              <OnboardingScreen
                {...props}
                onComplete={() => setHasCompletedOnboarding(true)}
              />
            )}
          </Stack.Screen>
        ) : !isLoggedIn ? (
          <>
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  {...props}
                  onSignIn={() => {
                  setAuthToken('dev-token');
                  setIsLoggedIn(true);
                }}
                  onNavigateToSignup={() => props.navigation.navigate('Signup')}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Signup">
              {(props) => (
                <SignupScreen
                  {...props}
                  onSignUp={() => {
                  setAuthToken('dev-token');
                  setIsLoggedIn(true);
                }}
                  onNavigateToLogin={() => props.navigation.goBack()}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Main">
            {() => <MainDrawer onLogout={() => { setAuthToken(null); setIsLoggedIn(false); }} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
