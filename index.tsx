import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Screen = 'Home' | 'Add' | 'View';
type Course = 'Starter' | 'Main' | 'Dessert';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: Course;
  price: string;
}

const courses: Course[] = ['Starter', 'Main', 'Dessert'];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<Course | ''>('');
  const [price, setPrice] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const resetForm = () => {
    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setIsDropdownOpen(false);
  };

  const returnHome = () => {
    resetForm();
    setCurrentScreen('Home');
  };

  const handleSaveDish = () => {
    const numericPrice = Number(price);

    if (!dishName.trim() || !description.trim() || !course || !price.trim()) {
      Alert.alert('Missing fields', 'Please complete all fields before saving.');
      return;
    }

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      Alert.alert('Invalid price', 'Enter a valid price greater than or equal to zero.');
      return;
    }

    setMenuItems((items) => [
      ...items,
      {
        id: Date.now().toString(),
        name: dishName.trim(),
        description: description.trim(),
        course,
        price: numericPrice.toFixed(2),
      },
    ]);

    resetForm();
    setCurrentScreen('View');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.brand}>Christoffel</Text>
        <View style={styles.navLinks}>
          {(['Home', 'Add', 'View'] as Screen[]).map((screen) => (
            <TouchableOpacity key={screen} onPress={() => setCurrentScreen(screen)}>
              <Text style={[styles.navLink, currentScreen === screen && styles.activeNavLink]}>
                {screen}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {currentScreen === 'Home' && (
        <View style={styles.home}>
          <Text style={styles.welcome}>Welcome to Christoffel, where flavor meets class.</Text>
          <TouchableOpacity style={[styles.button, styles.addButton]} onPress={() => setCurrentScreen('Add')}>
            <Text style={styles.buttonText}>Add to menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.viewButton]} onPress={() => setCurrentScreen('View')}>
            <Text style={styles.buttonText}>View menu</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentScreen === 'Add' && (
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>Add a dish</Text>
          <TextInput placeholder="Enter dish name" value={dishName} onChangeText={setDishName} style={styles.input} />
          <TextInput placeholder="Enter description" value={description} onChangeText={setDescription} style={styles.input} />

          <TouchableOpacity onPress={() => setIsDropdownOpen((open) => !open)} style={styles.input}>
            <Text>{course || 'Select course'}</Text>
          </TouchableOpacity>
          {isDropdownOpen && (
            <View style={styles.dropdown}>
              {courses.map((option) => (
                <TouchableOpacity key={option} style={styles.dropdownOption} onPress={() => {
                  setCourse(option);
                  setIsDropdownOpen(false);
                }}>
                  <Text>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TextInput placeholder="Enter price (in rand)" keyboardType="decimal-pad" value={price} onChangeText={setPrice} style={styles.input} />

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveDish}>
              <Text style={styles.buttonText}>Save dish</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={resetForm}>
              <Text style={styles.buttonText}>Clear form</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.button, styles.homeButton]} onPress={returnHome}>
            <Text style={styles.buttonText}>Return home</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {currentScreen === 'View' && (
        <View style={styles.menuScreen}>
          <Text style={styles.heading}>Menu</Text>
          {menuItems.length === 0 ? (
            <Text style={styles.emptyText}>No menu items have been added yet.</Text>
          ) : (
            <ScrollView horizontal>
              <View>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.nameColumn]}>Name</Text>
                  <Text style={[styles.tableCell, styles.descriptionColumn]}>Description</Text>
                  <Text style={[styles.tableCell, styles.courseColumn]}>Course</Text>
                  <Text style={[styles.tableCell, styles.priceColumn]}>Price</Text>
                </View>
                {menuItems.map((item) => (
                  <View key={item.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.nameColumn]}>{item.name}</Text>
                    <Text style={[styles.tableCell, styles.descriptionColumn]}>{item.description}</Text>
                    <Text style={[styles.tableCell, styles.courseColumn]}>{item.course}</Text>
                    <Text style={[styles.tableCell, styles.priceColumn]}>R {item.price}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.clearMenuButton]} onPress={() => setMenuItems([])}>
              <Text style={styles.buttonText}>Clear menu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.addButton]} onPress={() => setCurrentScreen('Add')}>
              <Text style={styles.buttonText}>Add dish</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.button, styles.homeButton]} onPress={returnHome}>
            <Text style={styles.buttonText}>Return home</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  navbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: '#eee' },
  brand: { fontSize: 18, fontWeight: 'bold' },
  navLinks: { flexDirection: 'row', gap: 14 },
  navLink: { color: '#333' },
  activeNavLink: { color: '#0066cc', fontWeight: 'bold' },
  home: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  welcome: { textAlign: 'center', fontSize: 18, marginBottom: 20 },
  form: { padding: 20 },
  menuScreen: { flex: 1, padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#bbb', borderRadius: 6, padding: 12, marginBottom: 12 },
  dropdown: { borderWidth: 1, borderColor: '#bbb', marginTop: -8, marginBottom: 12 },
  dropdownOption: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  button: { paddingVertical: 13, paddingHorizontal: 13, borderRadius: 6, marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  addButton: { backgroundColor: '#1769aa',},
  viewButton: { backgroundColor: '#1769aa' },
  saveButton: { backgroundColor: '#1769aa', flex: 1 },
  cancelButton: { backgroundColor: '#1769aa', flex: 1 },
  clearMenuButton: { backgroundColor: '#c62828', flex: 1 },
  homeButton: { backgroundColor: '#1769aa' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#777' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc', minWidth: 540 },
  tableHeader: { backgroundColor: '#e9e9e9', borderBottomWidth: 2, borderColor: '#333' },
  tableCell: { padding: 10 },
  nameColumn: { width: 120 },
  descriptionColumn: { width: 220 },
  courseColumn: { width: 110 },
  priceColumn: { width: 90 },
});
