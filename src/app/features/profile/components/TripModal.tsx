import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Switch, View } from 'react-native';

import { COUNTRIES } from '../data/countries';
import { useTheme } from '../theme';
import type { Trip } from '../types';
import Button from './Button';
import Field from './Field';
import Sheet from './Sheet';
import Txt from './Txt';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (trip: Omit<Trip, 'id'>) => void;
};

const validDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(`${s}T00:00:00`));

export default function TripModal({ visible, onClose, onSave }: Props) {
  return (
    <Sheet visible={visible} onClose={onClose} scroll={false}>
      {visible ? <TripForm onClose={onClose} onSave={onSave} /> : null}
    </Sheet>
  );
}

function TripForm({ onClose, onSave }: Omit<Props, 'visible'>) {
  const t = useTheme();
  const [place, setPlace] = useState('');
  const [country, setCountry] = useState<string | null>(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [note, setNote] = useState('');
  const [everest, setEverest] = useState(false);
  const [error, setError] = useState('');
  const [picking, setPicking] = useState(false);
  const [search, setSearch] = useState('');

  const sorted = useMemo(() => [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name)), []);
  const filtered = sorted.filter((c) => c.name.toLowerCase().includes(search.trim().toLowerCase()));
  const picked = COUNTRIES.find((c) => c.code === country);

  const save = () => {
    if (!place.trim() || !country) return setError('Add a place and pick a country.');
    if (!validDate(start) || !validDate(end)) return setError('Dates must look like 2025-03-02.');
    if (end < start) return setError('End date can’t be before the start date.');
    onSave({ place: place.trim(), country, start, end, note: note.trim(), everest });
    onClose();
  };

  if (picking) {
    return (
      <View style={{ flexShrink: 1 }}>
        <Txt weight="semiBold" size={20} color={t.ink}>
          Choose a country
        </Txt>
        <Field label="Search" value={search} onChangeText={setSearch} autoCorrect={false} />
        <FlatList
          style={{ marginTop: 8 }}
          data={filtered}
          keyExtractor={(c) => c.code}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setCountry(item.code);
                setPicking(false);
              }}
              style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: t.line }}>
              <Txt size={16} color={t.ink}>{`${item.flag}  ${item.name}`}</Txt>
            </Pressable>
          )}
        />
        <View style={{ alignItems: 'flex-end', marginTop: 12 }}>
          <Button variant="ghost" label="Back" onPress={() => setPicking(false)} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <Txt weight="semiBold" size={20} color={t.ink}>
        Add trip
      </Txt>
      <Field label="Place" value={place} onChangeText={setPlace} maxLength={60} placeholder="e.g. Kyoto" />
      <Txt size={13} color={t.muted} style={{ marginTop: 12 }}>
        Country
      </Txt>
      <View style={{ marginTop: 4, alignItems: 'flex-start' }}>
        <Button
          label={picked ? `${picked.flag} ${picked.name}` : 'Choose a country'}
          onPress={() => setPicking(true)}
        />
      </View>
      <Field
        label="Start date"
        value={start}
        onChangeText={setStart}
        placeholder="YYYY-MM-DD"
        maxLength={10}
        keyboardType="numbers-and-punctuation"
      />
      <Field
        label="End date"
        value={end}
        onChangeText={setEnd}
        placeholder="YYYY-MM-DD"
        maxLength={10}
        keyboardType="numbers-and-punctuation"
      />
      <Field
        label="Note"
        value={note}
        onChangeText={setNote}
        maxLength={120}
        multiline
        style={{ minHeight: 60, textAlignVertical: 'top' }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        <Txt size={15} color={t.ink}>
          Climbed Mount Everest 🏔️
        </Txt>
        <Switch value={everest} onValueChange={setEverest} trackColor={{ true: t.brand }} />
      </View>
      <Txt size={13} color={t.danger} style={{ marginTop: 8, minHeight: 18 }}>
        {error}
      </Txt>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
        <Button variant="ghost" label="Cancel" onPress={onClose} />
        <Button variant="primary" label="Save trip" onPress={save} />
      </View>
    </ScrollView>
  );
}
