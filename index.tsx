import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Screen = 'Home' | 'Menu' | 'Chef' | 'ChefForm';
type Course = 'Starter' | 'Main' | 'Dessert';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: Course;
  price: string;
}

type Notice = {
  message: string;
  kind: 'success' | 'error';
};

type Confirmation = {
  message: string;
  onConfirm: () => void;
};

const courses: Course[] = ['Starter', 'Main', 'Dessert'];

const courseLabel = (value: Course) =>
  value === 'Main' ? 'Main Course' : value;

const money = (value: number) => `R ${value.toFixed(2)}`;

const serif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

// Reusable button
function Button({
  title,
  onPress,
  secondary = false,
  danger = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.button,
        secondary && styles.secondaryButton,
        danger && styles.dangerButton,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          secondary && styles.secondaryText,
          danger && styles.dangerText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// Reusable statistics card
function Statistic({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statistic}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

// Reusable dropdown: no additional packages needed
function Dropdown<T extends string>({
  label,
  value,
  options,
  open,
  onToggle,
  onSelect,
  placeholder,
}: {
  label: string;
  value: T | '';
  options: { value: T; label: string }[];
  open: boolean;
  onToggle: () => void;
  onSelect: (value: T) => void;
  placeholder?: string;
}) {
  const selectedLabel =
    options.find(option => option.value === value)?.label ??
    placeholder ??
    'Select';

  return (
    <View style={styles.dropdownWrap}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selectedLabel}`}
        accessibilityState={{ expanded: open }}
        onPress={onToggle}
        style={styles.dropdownTrigger}
      >
        <Text style={styles.dropdownText}>{selectedLabel}</Text>

        <Text
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={styles.arrow}
        >
          {open ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownOptions}>
          {options.map(option => (
            <TouchableOpacity
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{
                selected: value === option.value,
              }}
              onPress={() => onSelect(option.value)}
              style={[
                styles.option,
                value === option.value && styles.selectedOption,
              ]}
            >
              <Text
                style={[
                  styles.dropdownText,
                  value === option.value && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<Course | ''>('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] =
    useState<Course | 'All'>('All');

  const [notice, setNotice] = useState<Notice | null>(null);
  const [confirmation, setConfirmation] =
    useState<Confirmation | null>(null);

  const [courseOpen, setCourseOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const isChef =
    currentScreen === 'Chef' || currentScreen === 'ChefForm';

  const resetForm = () => {
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setEditingId(null);
    setCourseOpen(false);
  };

  const navigate = (screen: Screen) => {
    resetForm();
    setNotice(null);
    setConfirmation(null);
    setFilterOpen(false);
    setCurrentScreen(screen);
  };

  const clearFilters = () => {
    setSearch('');
    setCourseFilter('All');
    setFilterOpen(false);
  };

  const handleSaveDish = () => {
    if (currentScreen !== 'ChefForm') return;

    const normalizedPrice = price.trim().replace(',', '.');
    const numericPrice = Number(normalizedPrice);

    if (
      !dishName.trim() ||
      !description.trim() ||
      !course ||
      !price.trim()
    ) {
      setNotice({
        message:
          'Please complete the name, description, course and price.',
        kind: 'error',
      });
      return;
    }

    if (
      !/^\d+(\.\d{1,2})?$/.test(normalizedPrice) ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      setNotice({
        message:
          'Enter a price greater than zero, with at most two decimal places.',
        kind: 'error',
      });
      return;
    }

    const item: MenuItem = {
      id:
        editingId ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: dishName.trim(),
      description: description.trim(),
      course,
      price: numericPrice.toFixed(2),
    };

    setMenuItems(items =>
      editingId
        ? items.map(existing =>
            existing.id === editingId ? item : existing,
          )
        : [...items, item],
    );

    setNotice({
      message: `${item.name} was ${editingId ? 'updated' : 'added'}.`,
      kind: 'success',
    });

    resetForm();
    clearFilters();
    setConfirmation(null);
    setCurrentScreen('Chef');
  };

  const editDish = (item: MenuItem) => {
    if (currentScreen !== 'Chef') return;

    setDishName(item.name);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price);
    setEditingId(item.id);

    setNotice(null);
    setConfirmation(null);
    setCourseOpen(false);
    setFilterOpen(false);
    setCurrentScreen('ChefForm');
  };

  const requestDelete = (item: MenuItem) => {
    if (currentScreen !== 'Chef') return;

    setConfirmation({
      message: `Delete ${item.name} from the menu?`,
      onConfirm: () => {
        setMenuItems(items =>
          items.filter(existing => existing.id !== item.id),
        );

        setNotice({
          message: `${item.name} was deleted.`,
          kind: 'success',
        });
      },
    });
  };

  const requestClearMenu = () => {
    if (currentScreen !== 'Chef') return;

    setConfirmation({
      message: `Delete all ${menuItems.length} dishes? This cannot be undone.`,
      onConfirm: () => {
        setMenuItems([]);
        clearFilters();
        setNotice({
          message: 'The menu was cleared.',
          kind: 'success',
        });
      },
    });
  };

  const filteredItems = menuItems.filter(
    item =>
      item.name.toLowerCase().includes(search.trim().toLowerCase()) &&
      (courseFilter === 'All' || item.course === courseFilter),
  );

  const totalPrice = menuItems.reduce(
    (sum, item) => sum + Number(item.price),
    0,
  );

  const averagePrice = menuItems.length
    ? totalPrice / menuItems.length
    : 0;

  const renderStatistics = () => (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>AT A GLANCE</Text>
      <Text style={styles.subheading}>Menu statistics</Text>
      <Text style={styles.muted}>
        Based on the entire menu, not only search results.
      </Text>

      <View style={styles.statistics}>
        <Statistic
          label="Total dishes"
          value={String(menuItems.length)}
        />
        <Statistic
          label="Average price"
          value={money(averagePrice)}
        />

        {courses.map(value => (
          <Statistic
            key={value}
            label={courseLabel(value)}
            value={String(
              menuItems.filter(item => item.course === value).length,
            )}
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <View style={styles.brandBlock}>
          <Text style={styles.brand}>Christoffel</Text>
          <Text style={styles.brandSubtitle}>THE ART OF DINING</Text>
        </View>

        <View style={styles.row}>
          {(
            [
              { screen: 'Home', label: 'Home' },
              { screen: 'Menu', label: 'Menu' },
              { screen: 'Chef', label: 'Chef Board' },
            ] as const
          ).map(tab => {
            const selected =
              currentScreen === tab.screen ||
              (tab.screen === 'Chef' && isChef);

            return (
              <TouchableOpacity
                key={tab.screen}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => navigate(tab.screen)}
                style={[
                  styles.navButton,
                  selected && styles.selectedNav,
                ]}
              >
                <Text
                  style={[
                    styles.navText,
                    selected && styles.activeNav,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {isChef && notice && (
          <View
            accessibilityLiveRegion="polite"
            style={[
              styles.notice,
              notice.kind === 'error' && styles.errorNotice,
            ]}
          >
            <Text style={styles.noticeText}>{notice.message}</Text>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Dismiss message"
              onPress={() => setNotice(null)}
              style={styles.navButton}
            >
              <Text style={styles.dismissText}>×</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentScreen === 'Chef' && confirmation && (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>PLEASE CONFIRM</Text>
            <Text style={styles.body}>{confirmation.message}</Text>

            <Button
              title="Confirm deletion"
              danger
              onPress={() => {
                confirmation.onConfirm();
                setConfirmation(null);
              }}
            />

            <Button
              title="Keep menu unchanged"
              secondary
              onPress={() => setConfirmation(null)}
            />
          </View>
        )}

        {currentScreen === 'Home' && (
          <View style={[styles.card, styles.hero]}>
            <Text style={styles.eyebrow}>
              FINE DINING · THOUGHTFULLY CURATED
            </Text>

            <View style={styles.goldRule} />

            <Text style={styles.heroHeading}>
              Welcome to{'\n'}Christoffel
            </Text>

            <Text style={styles.heroBody}>
              Where flavor meets class. Discover the menu, or curate
              the collection from the chef board.
            </Text>

            <Button
              title="View menu"
              onPress={() => navigate('Menu')}
            />

            <Button
              title="Open Chef Board"
              secondary
              onPress={() => navigate('Chef')}
            />
          </View>
        )}

        {currentScreen === 'Chef' && (
          <>
            <Text style={styles.eyebrow}>FROM THE KITCHEN</Text>
            <Text style={styles.heading}>Chef editing board</Text>

            <Text style={styles.intro}>
              Add, edit and remove dishes here. The customer menu is
              read-only.
            </Text>

            <Text style={styles.accessNote}>
              This board is a separate workspace, not a
              password-protected area.
            </Text>

            {renderStatistics()}

            <View style={styles.card}>
              <Text style={styles.subheading}>Curate your menu</Text>

              <Button
                title="Add a dish"
                onPress={() => navigate('ChefForm')}
              />

              {menuItems.length > 0 && (
                <Button
                  title="Clear entire menu"
                  danger
                  onPress={requestClearMenu}
                />
              )}
            </View>
          </>
        )}

        {currentScreen === 'ChefForm' && (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>
              CHEF BOARD · FROM THE KITCHEN
            </Text>

            <Text style={styles.heading}>
              {editingId ? 'Edit dish' : 'Add a dish'}
            </Text>

            <Text style={styles.label}>Dish name</Text>
            <TextInput
              accessibilityLabel="Dish name"
              placeholderTextColor="#716F63"
              placeholder="Enter dish name"
              value={dishName}
              onChangeText={setDishName}
              style={styles.input}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              accessibilityLabel="Description"
              placeholderTextColor="#716F63"
              placeholder="Describe the dish"
              value={description}
              onChangeText={setDescription}
              multiline
              style={[styles.input, styles.description]}
            />

            <Dropdown<Course>
              label="Course"
              value={course}
              placeholder="Select a course"
              options={courses.map(value => ({
                value,
                label: courseLabel(value),
              }))}
              open={courseOpen}
              onToggle={() => setCourseOpen(open => !open)}
              onSelect={value => {
                setCourse(value);
                setCourseOpen(false);
              }}
            />

            <Text style={styles.label}>Price in rand</Text>
            <TextInput
              accessibilityLabel="Price in rand"
              placeholderTextColor="#716F63"
              placeholder="e.g. 85.50"
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
              style={styles.input}
            />

            <Button
              title={editingId ? 'Save changes' : 'Save dish'}
              onPress={handleSaveDish}
            />

            {!editingId && (
              <Button
                title="Clear form"
                secondary
                onPress={() => {
                  resetForm();
                  setNotice(null);
                }}
              />
            )}

            <Button
              title="Cancel and return to Chef Board"
              secondary
              onPress={() => navigate('Chef')}
            />
          </View>
        )}

        {(currentScreen === 'Menu' || currentScreen === 'Chef') && (
          <View>
            <Text style={styles.eyebrow}>
              {currentScreen === 'Menu'
                ? 'THE CHRISTOFFEL COLLECTION'
                : 'YOUR DISH COLLECTION'}
            </Text>

            <Text style={styles.heading}>
              {currentScreen === 'Menu' ? 'Menu' : 'Manage dishes'}
            </Text>

            <View style={styles.card}>
              <Text style={styles.label}>Search by dish name</Text>
              <TextInput
                accessibilityLabel="Search by dish name"
                placeholderTextColor="#716F63"
                placeholder="Search menu..."
                value={search}
                onChangeText={setSearch}
                style={styles.input}
              />

              <Dropdown<Course | 'All'>
                label="Filter by course"
                value={courseFilter}
                options={[
                  { value: 'All', label: 'All courses' },
                  ...courses.map(value => ({
                    value,
                    label: courseLabel(value),
                  })),
                ]}
                open={filterOpen}
                onToggle={() => setFilterOpen(open => !open)}
                onSelect={value => {
                  setCourseFilter(value);
                  setFilterOpen(false);
                }}
              />

              <Button
                title="Clear search and filters"
                secondary
                onPress={clearFilters}
              />
            </View>

            <Text style={styles.resultsText}>
              Showing {filteredItems.length} of {menuItems.length} dishes
            </Text>

            {filteredItems.length === 0 && (
              <Text style={styles.emptyText}>
                {menuItems.length
                  ? 'No matching dishes. Try another search or clear the filters.'
                  : currentScreen === 'Chef'
                    ? 'Your menu is empty. Select Add a dish above to begin your collection.'
                    : 'Our menu is being prepared. Please check back soon.'}
              </Text>
            )}

            {filteredItems.map(item => (
              <View
                key={item.id}
                style={[styles.card, styles.menuCard]}
              >
                <Text style={styles.eyebrow}>
                  {courseLabel(item.course).toUpperCase()}
                </Text>

                <Text style={styles.dishName}>{item.name}</Text>
                <Text style={styles.body}>{item.description}</Text>

                <View style={styles.priceLine}>
                  <View style={styles.priceRule} />
                  <Text style={styles.price}>
                    {money(Number(item.price))}
                  </Text>
                </View>

                {currentScreen === 'Chef' && (
                  <>
                    <Button
                      title={`Edit ${item.name}`}
                      secondary
                      onPress={() => editDish(item)}
                    />

                    <Button
                      title={`Delete ${item.name}`}
                      danger
                      onPress={() => requestDelete(item)}
                    />
                  </>
                )}
              </View>
            ))}

            <Button
              title="Return home"
              secondary
              onPress={() => navigate('Home')}
            />
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.goldRule} />
          <Text style={styles.footerText}>
            CHRISTOFFEL · WHERE FLAVOR MEETS CLASS
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  navbar: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#173C32',
    borderBottomWidth: 2,
    borderBottomColor: '#B99A58',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandBlock: {
    paddingVertical: 6,
    marginRight: 14,
  },
  brand: {
    color: '#FCF7EA',
    fontFamily: serif,
    fontSize: 30,
    letterSpacing: 0.4,
  },
  brandSubtitle: {
    color: '#DFCA98',
    fontSize: 10,
    letterSpacing: 2.2,
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  navButton: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    minHeight: 48,
    justifyContent: 'center',
  },
  selectedNav: {
    backgroundColor: '#244E41',
    borderRadius: 4,
  },
  navText: {
    color: '#DFCA98',
    fontSize: 15,
    fontWeight: '600',
  },
  activeNav: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  content: {
    padding: 18,
    paddingTop: 26,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 850,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#FFFCF5',
    padding: 22,
    borderRadius: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DCD1BB',
  },
  hero: {
    backgroundColor: '#EEE7D8',
    paddingVertical: 34,
    borderTopWidth: 3,
    borderTopColor: '#B99A58',
  },
  eyebrow: {
    color: '#79602D',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.7,
    lineHeight: 19,
    marginBottom: 10,
  },
  goldRule: {
    height: 1,
    width: 48,
    backgroundColor: '#A88A48',
    marginVertical: 12,
  },
  heroHeading: {
    fontFamily: serif,
    fontSize: 38,
    lineHeight: 46,
    color: '#173C32',
    marginTop: 8,
    marginBottom: 14,
  },
  heroBody: {
    fontSize: 16,
    lineHeight: 27,
    color: '#4B564A',
    marginBottom: 18,
    maxWidth: 500,
  },
  heading: {
    fontFamily: serif,
    fontSize: 32,
    lineHeight: 40,
    color: '#173C32',
    marginBottom: 20,
  },
  subheading: {
    fontFamily: serif,
    fontSize: 25,
    color: '#173C32',
    marginBottom: 10,
  },
  dishName: {
    fontFamily: serif,
    fontSize: 27,
    lineHeight: 35,
    color: '#173C32',
    marginBottom: 4,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: '#455044',
    marginVertical: 10,
  },
  intro: {
    fontSize: 16,
    lineHeight: 26,
    color: '#455044',
    marginBottom: 10,
  },
  accessNote: {
    fontSize: 13,
    lineHeight: 21,
    color: '#5F655A',
    marginBottom: 22,
  },
  muted: {
    fontSize: 14,
    color: '#5F655A',
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#294337',
    marginBottom: 9,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#A99F88',
    backgroundColor: '#FFFEFA',
    borderRadius: 4,
    padding: 14,
    color: '#20382E',
    fontSize: 16,
    marginBottom: 14,
    minHeight: 50,
  },
  description: {
    minHeight: 112,
    textAlignVertical: 'top',
  },
  dropdownWrap: {
    marginBottom: 14,
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: '#A99F88',
    backgroundColor: '#FFFEFA',
    borderRadius: 4,
    padding: 14,
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    color: '#20382E',
    fontSize: 16,
    lineHeight: 23,
    flexShrink: 1,
  },
  arrow: {
    color: '#79602D',
    fontSize: 16,
    marginLeft: 14,
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#B6A783',
    borderRadius: 4,
    marginTop: 6,
    overflow: 'hidden',
    backgroundColor: '#FFFCF5',
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    minHeight: 50,
  },
  selectedOption: {
    backgroundColor: '#1C493A',
  },
  selectedOptionText: {
    color: '#FFFCF4',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#1C493A',
    borderRadius: 4,
    padding: 15,
    marginTop: 12,
    minHeight: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1C493A',
  },
  secondaryButton: {
    backgroundColor: '#F1EBDD',
    borderColor: '#C8B995',
  },
  dangerButton: {
    backgroundColor: '#FBF0EB',
    borderColor: '#B77765',
  },
  buttonText: {
    color: '#FFFCF4',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  secondaryText: {
    color: '#244435',
  },
  dangerText: {
    color: '#8A3329',
  },
  statistics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  statistic: {
    minWidth: 110,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#C6B382',
    backgroundColor: '#F5F0E4',
    marginRight: 8,
    marginBottom: 8,
    flexGrow: 1,
    flexBasis: 120,
  },
  statValue: {
    color: '#173C32',
    fontFamily: serif,
    fontSize: 25,
    marginBottom: 8,
  },
  menuCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#B99A58',
    marginTop: 4,
  },
  priceLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  priceRule: {
    height: 1,
    flex: 1,
    backgroundColor: '#D9CCAC',
    marginRight: 16,
  },
  price: {
    fontFamily: serif,
    fontSize: 25,
    color: '#173C32',
    flexShrink: 1,
  },
  resultsText: {
    fontSize: 13,
    color: '#5F655A',
    lineHeight: 21,
    marginBottom: 14,
  },
  emptyText: {
    textAlign: 'center',
    padding: 24,
    color: '#5F655A',
    fontSize: 16,
    lineHeight: 26,
    fontFamily: serif,
  },
  notice: {
    padding: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A9BBA5',
    backgroundColor: '#E7EFE2',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorNotice: {
    backgroundColor: '#FBE8DF',
    borderColor: '#C78D79',
  },
  noticeText: {
    flex: 1,
    color: '#20382E',
    fontSize: 15,
    lineHeight: 23,
  },
  dismissText: {
    color: '#294337',
    fontSize: 24,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 28,
    paddingHorizontal: 10,
  },
  footerText: {
    color: '#68624F',
    fontSize: 10,
    lineHeight: 19,
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: 4,
  },
});