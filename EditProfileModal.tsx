import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Avatar from "./Avatar";
import Button from "./Button";
import Field from "./Field";
import Sheet from "./Sheet";
import { useTheme } from "../theme";
import { ProfileState } from "../types";

type Props = {
  visible: boolean;
  profile: Pick<ProfileState, "name" | "username" | "bio" | "avatar">;
  onClose: () => void;
  onSave: (patch: Pick<ProfileState, "name" | "username" | "bio" | "avatar">) => void;
};

export default function EditProfileModal({ visible, profile, onClose, onSave }: Props) {
  const t = useTheme();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      setName(profile.name);
      setUsername(profile.username);
      setBio(profile.bio);
      setAvatar(profile.avatar);
      setError("");
    }
  }, [visible]);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });
    if (!result.canceled && result.assets[0].base64) {
      setAvatar(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const save = () => {
    const clean = username.trim().replace(/^@/, "");
    if (!/^[A-Za-z0-9_.]{3,20}$/.test(clean)) {
      setError("Username: 3–20 characters, letters, numbers, _ or . only.");
      return;
    }
    onSave({ name: name.trim() || profile.name, username: clean, bio: bio.trim(), avatar });
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Edit profile">
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginTop: 14 }}>
        <Avatar uri={avatar} />
        <Button small label="Change photo" onPress={pickPhoto} />
        <Button small variant="ghost" label="Remove" onPress={() => setAvatar(null)} />
      </View>
      <Field label="Name" value={name} onChangeText={setName} maxLength={40} />
      <Field label="Username" value={username} onChangeText={setUsername} maxLength={20} autoCapitalize="none" autoCorrect={false} />
      <Field label="Bio" value={bio} onChangeText={setBio} maxLength={150} multiline style={{ minHeight: 70, textAlignVertical: "top" }} />
      <Text style={{ color: t.muted, fontSize: 12, marginTop: 4 }}>{`${bio.length}/150`}</Text>
      <Text style={{ color: t.danger, fontSize: 13, marginTop: 6, minHeight: 18 }}>{error}</Text>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
        <Button variant="ghost" label="Cancel" onPress={onClose} />
        <Button variant="primary" label="Save" onPress={save} />
      </View>
    </Sheet>
  );
}
