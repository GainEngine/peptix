import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretDown } from 'phosphor-react-native';
import { Text } from './Text';
import { PeptidePicker } from './PeptidePicker';
import { theme } from '../../theme';
import type { Weekday, DosageUnit } from '../../types/peptide';
import { ALL_WEEKDAYS } from '../../types/peptide';
import { deviceUses24Hour } from '../../utils/time';

const IS_24H = deviceUses24Hour();

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    dosage: number;
    dosageUnit: DosageUnit;
    days: Weekday[];
    hour: number;
    minute: number;
  }) => void;
}

const UNITS: DosageUnit[] = ['mg', 'mcg', 'units'];

export function AddPeptideModal({ visible, onClose, onSave }: Props) {
  const insets = useSafeAreaInsets();
  const dosageRef = useRef<TextInput>(null);

  const [pickerVisible, setPickerVisible] = useState(false);
  const [name, setName] = useState('');
  const [dosageText, setDosageText] = useState('');
  const [dosageUnit, setDosageUnit] = useState<DosageUnit>('mcg');
  const [selectedDays, setSelectedDays] = useState<Weekday[]>([]);
  const [time, setTime] = useState<Date>(() => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  });

  function reset() {
    setPickerVisible(false);
    setName('');
    setDosageText('');
    setDosageUnit('mcg');
    setSelectedDays([]);
    setTime((() => { const d = new Date(); d.setHours(8, 0, 0, 0); return d; })());
  }

  function handleClose() {
    Keyboard.dismiss();
    reset();
    onClose();
  }

  function toggleDay(day: Weekday) {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
    );
  }

  function toggleAll() {
    setSelectedDays(prev =>
      prev.length === ALL_WEEKDAYS.length ? [] : [...ALL_WEEKDAYS],
    );
  }

  function handleSave() {
    const dosage = parseFloat(dosageText);
    if (!name.trim() || isNaN(dosage) || selectedDays.length === 0) return;
    onSave({
      name: name.trim(),
      dosage,
      dosageUnit,
      days: selectedDays,
      hour: time.getHours(),
      minute: time.getMinutes(),
    });
    reset();
    onClose();
  }

  const allSelected = selectedDays.length === ALL_WEEKDAYS.length;
  const canSave = name.trim().length > 0 && dosageText.length > 0 && selectedDays.length > 0;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text variant="label" color={theme.colors.text.secondary} style={styles.cancelBtn}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text variant="label" style={styles.headerTitle}>
            NEW PEPTIDE
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text
              variant="label"
              style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
        >
          {/* Peptide */}
          <View style={styles.field}>
            <Text variant="label" color={theme.colors.text.secondary} style={styles.fieldLabel}>
              Peptide
            </Text>
            <TouchableOpacity
              style={styles.pickerRow}
              onPress={() => { Keyboard.dismiss(); setPickerVisible(true); }}
              activeOpacity={0.7}
            >
              <Text
                variant="body"
                style={[styles.pickerValue, !name && styles.pickerPlaceholder]}
              >
                {name || 'Select peptide'}
              </Text>
              <CaretDown
                size={theme.icons.size.sm}
                color={theme.colors.text.secondary}
                weight={theme.icons.weight}
              />
            </TouchableOpacity>
          </View>

          {/* Dosage */}
          <View style={styles.field}>
            <Text variant="label" color={theme.colors.text.secondary} style={styles.fieldLabel}>
              Dosage
            </Text>
            <View style={styles.dosageRow}>
              <TextInput
                ref={dosageRef}
                style={[styles.input, styles.dosageInput]}
                value={dosageText}
                onChangeText={setDosageText}
                placeholder="0"
                placeholderTextColor="rgba(255,255,255,0.18)"
                keyboardType="decimal-pad"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
              <View style={styles.unitSelector}>
                {UNITS.map(u => (
                  <TouchableOpacity
                    key={u}
                    onPress={() => { Keyboard.dismiss(); setDosageUnit(u); }}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  >
                    <Text
                      variant="label"
                      style={[
                        styles.unitOption,
                        dosageUnit === u ? styles.unitActive : styles.unitInactive,
                      ]}
                    >
                      {u}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Days */}
          <View style={styles.field}>
            <Text variant="label" color={theme.colors.text.secondary} style={styles.fieldLabel}>
              Days
            </Text>
            <View style={styles.daysRow}>
              <TouchableOpacity
                onPress={() => { Keyboard.dismiss(); toggleAll(); }}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              >
                <Text
                  variant="label"
                  style={[styles.dayChip, allSelected ? styles.dayActive : styles.dayInactive]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {ALL_WEEKDAYS.map(day => {
                const active = selectedDays.includes(day);
                return (
                  <TouchableOpacity
                    key={day}
                    onPress={() => { Keyboard.dismiss(); toggleDay(day); }}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  >
                    <Text
                      variant="label"
                      style={[styles.dayChip, active ? styles.dayActive : styles.dayInactive]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Time */}
          <View style={styles.field}>
            <Text variant="label" color={theme.colors.text.secondary} style={styles.fieldLabel}>
              Time
            </Text>
            <DateTimePicker
              value={time}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              is24Hour={IS_24H}
              onChange={(_, selected) => selected && setTime(selected)}
              style={styles.timePicker}
              themeVariant="dark"
            />
          </View>
        </ScrollView>

        {/* PeptidePicker — absoluteFill overlay, ei nested Modal */}
        <PeptidePicker
          visible={pickerVisible}
          onClose={() => setPickerVisible(false)}
          onSelect={item => {
            setName(item.name);
            setDosageUnit(item.defaultUnit);
            setPickerVisible(false);
            setTimeout(() => dosageRef.current?.focus(), 300);
          }}
          onSelectCustom={customName => {
            setName(customName);
            setPickerVisible(false);
            setTimeout(() => dosageRef.current?.focus(), 300);
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: {
    letterSpacing: 3,
    opacity: 0.5,
  },
  cancelBtn: {
    letterSpacing: 0.5,
  },
  saveBtn: {
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  saveBtnDisabled: {
    opacity: 0.25,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[10],
  },

  // Fields
  field: {
    marginBottom: theme.spacing[6],
  },
  fieldLabel: {
    letterSpacing: 1,
    marginBottom: theme.spacing[2],
    opacity: 0.6,
  },
  input: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: '300',
    paddingVertical: theme.spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },

  // Peptide picker row
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  pickerValue: {
    fontSize: 16,
    fontWeight: '300',
    color: theme.colors.text.primary,
  },
  pickerPlaceholder: {
    color: 'rgba(255,255,255,0.18)',
  },

  // Dosage row
  dosageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[5],
  },
  dosageInput: {
    flex: 1,
  },
  unitSelector: {
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  unitOption: {
    letterSpacing: 0.5,
  },
  unitActive: {
    color: theme.colors.text.primary,
    opacity: 1,
  },
  unitInactive: {
    color: theme.colors.text.secondary,
    opacity: 0.5,
  },

  // Days
  daysRow: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    flexWrap: 'nowrap',
  },
  dayChip: {
    letterSpacing: 0.5,
  },
  dayActive: {
    color: theme.colors.text.primary,
    opacity: 1,
  },
  dayInactive: {
    color: theme.colors.text.secondary,
    opacity: 0.4,
  },

  // Time
  timePicker: {
    marginLeft: -theme.spacing[3],
    height: 100,
    overflow: 'hidden',
  },
});
