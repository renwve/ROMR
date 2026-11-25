import { SafeAreaProvider } from 'react-native-safe-area-context';
import ProfileScreen from './src/app/features/profile/ProfileScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <ProfileScreen />
    </SafeAreaProvider>
  );
}
