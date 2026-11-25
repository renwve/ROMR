import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";

function NotificationRow({
  title,
  subtitle,
  value,
  onValueChange,
  disabled = false,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: "#D5D8E0",
          true: "#AFC5F5",
        }}
        thumbColor={value ? "#10184B" : "#FFFFFF"}
      />
    </View>
  );
}

export default function NotificationSettings() {
  const [discoveries, setDiscoveries] = useState(true);
  const [deals, setDeals] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [community, setCommunity] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Retrieve saved notification preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const saved = await AsyncStorage.getItem("notificationPreferences");

        if (saved !== null) {
          const preferences = JSON.parse(saved);

          setDiscoveries(preferences.discoveries ?? true);
          setDeals(preferences.deals ?? true);
          setReminders(preferences.reminders ?? true);
          setCommunity(preferences.community ?? false);
        }

        setLoaded(true);
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };

    loadPreferences();
  }, []);

  // Save notification preferences whenever they change
  useEffect(() => {
    if (!loaded) return;

    const savePreferences = async () => {
      try {
        const preferences = {
          discoveries,
          deals,
          reminders,
          community,
        };

        await AsyncStorage.setItem(
          "notificationPreferences",
          JSON.stringify(preferences),
        );
      } catch (error) {
        console.error("Error saving preferences:", error);
      }
    };

    savePreferences();
  }, [discoveries, deals, reminders, community, loaded]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#10184B" />
        </Pressable>

        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.welcome}>
          <Text style={styles.welcomeTitle}>Stay in the loop</Text>
          <Text style={styles.welcomeText}>
            Choose which updates you'd like to receive from ROMR.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>NOTIFICATION PREFERENCES</Text>

        <View style={styles.card}>
          <NotificationRow
            title="Destination Discoveries"
            subtitle="Discover new places to explore"
            value={discoveries}
            onValueChange={setDiscoveries}
            disabled={!loaded}
          />

          <View style={styles.divider} />

          <NotificationRow
            title="Travel Deals & Offers"
            subtitle="Get updates on travel offers"
            value={deals}
            onValueChange={setDeals}
            disabled={!loaded}
          />

          <View style={styles.divider} />

          <NotificationRow
            title="Trip Reminders"
            subtitle="Stay on top of your upcoming trips"
            value={reminders}
            onValueChange={setReminders}
            disabled={!loaded}
          />

          <View style={styles.divider} />

          <NotificationRow
            title="Community Activity"
            subtitle="Stay updated on community activity"
            value={community}
            onValueChange={setCommunity}
            disabled={!loaded}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EAF0",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 22,
    fontFamily: "BeVietnamProBold",
    color: "#10184B",
  },

  content: {
    padding: 20,
    paddingBottom: 45,
  },

  welcome: {
    backgroundColor: "#E9F1FF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
  },

  welcomeTitle: {
    fontFamily: "BeVietnamProBold",
    fontSize: 18,
    color: "#10184B",
    marginBottom: 6,
  },

  welcomeText: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 12,
    color: "#737987",
    lineHeight: 19,
  },

  sectionTitle: {
    fontFamily: "BeVietnamProSemiBold",
    fontSize: 11,
    letterSpacing: 1,
    color: "#737987",
    marginTop: 23,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E8EAF0",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    minHeight: 76,
  },

  rowText: {
    flex: 1,
    marginRight: 12,
  },

  rowTitle: {
    fontFamily: "BeVietnamProSemiBold",
    fontSize: 13,
    color: "#10184B",
  },

  subtitle: {
    fontFamily: "BeVietnamProRegular",
    fontSize: 11,
    color: "#737987",
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#E8EAF0",
    marginHorizontal: 15,
  },
});
