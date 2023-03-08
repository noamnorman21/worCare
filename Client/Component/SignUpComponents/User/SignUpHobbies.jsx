import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, Dimensions, SafeAreaView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import HobbiesData from './Hobbies.json';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SignUpHobbies({ navigation, route }) {
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);
  const [modal4Visible, setModal4Visible] = useState(false);
  const [modal5Visible, setModal5Visible] = useState(false);
  const [modal6Visible, setModal6Visible] = useState(false);

  const [books, setBooks] = useState(HobbiesData.books);
  const [booksOther, setBooksOther] = useState('');
  const [music, setMusic] = useState(HobbiesData.music);
  const [musicOther, setMusicOther] = useState('');
  const [tvShows, setTvShows] = useState(HobbiesData.tvShows);
  const [tvShowsOther, setTvShowsOther] = useState('');
  const [radioChannel, setRadioChannel] = useState(HobbiesData.radioChannel);
  const [radioChannelOther, setRadioChannelOther] = useState('');
  const [food, setFood] = useState(HobbiesData.food);
  const [foodOther, setFoodOther] = useState('');
  const [drink, setDrink] = useState(HobbiesData.drink);
  const [drinkOther, setDrinkOther] = useState('');
  const [hobbies, setHobbies] = useState(HobbiesData.hobbies);
  const [hobbiesOther, setHobbiesOther] = useState('');
  const [movies, setMovies] = useState(HobbiesData.movies);
  const [moviesOther, setMoviesOther] = useState('');
  const [other, setOther] = useState('');

  const hours = [...Array(25)].map((_, i) => `${i}:00`);
  hours.unshift('Select...');
  const [selectedNightHour, setSelectedNightHour] = useState('');
  const [selectedAfterNoonNaps, setSelectedAfterNoonNaps] = useState('');

  const NavigateToNextLVL = () => {
    const activeBooks = books.filter((book) => book.selected).map((book) => book.name);
    const activeMusic = music.filter((music) => music.selected).map((music) => music.name);
    const activeTvShows = tvShows.filter((tvShow) => tvShow.selected).map((tvShow) => tvShow.name);
    const activeRadioChannel = radioChannel.filter((radio) => radio.selected).map((radio) => radio.name);
    const activeFood = food.filter((food) => food.selected).map((food) => food.name);
    const activeDrink = drink.filter((drink) => drink.selected).map((drink) => drink.name);
    const activeHobbies = hobbies.filter((hobby) => hobby.selected).map((hobby) => hobby.name);
    const activeMovies = movies.filter((movie) => movie.selected).map((movie) => movie.name);   
    if (booksOther !== '') {
      activeBooks.push(booksOther);
    }
    if (musicOther !== '') {
      activeMusic.push(musicOther);
    }
    if (tvShowsOther !== '') {
      activeTvShows.push(tvShowsOther);
    }
    if (radioChannelOther !== '') {
      activeRadioChannel.push(radioChannelOther);
    }
    if (foodOther !== '') {
      activeFood.push(foodOther);
    }
    if (drinkOther !== '') {
      activeDrink.push(drinkOther);
    }
    if (hobbiesOther !== '') {
      activeHobbies.push(hobbiesOther);
    }
    if (moviesOther !== '') {
      activeMovies.push(moviesOther);
    }
    const tblHobbies = {
      books: activeBooks,
      music: activeMusic,
      TVShow: activeTvShows,
      radioChannel: activeRadioChannel,
      food: activeFood,
      drink: activeDrink,
      specialHabits: activeHobbies,
      movie: activeMovies,
      afternoonNap: selectedAfterNoonNaps,
      nightSleep: selectedNightHour,
      other: other
    };
    const tblLimitations = route.params.tblLimitations;
    navigation.navigate('SignUpFinish', { tblHobbies: tblHobbies, tblLimitations: tblLimitations });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Add Patient’s Hobbies</Text>
        <View style={styles.line} />
      </View>
      {/* Books */}
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModal1Visible(true)}>
        <Text style={styles.input}>Books</Text>
        <Entypo style={styles.icon} name="chevron-right" size={24} color="black" />
      </TouchableOpacity>

      {/* Books Modal */}
      <Modal animationType="slide" visible={modal1Visible}>
        <View style={styles.modal}>
          <Text style={styles.modalText}>Pick Books</Text>
          <View style={styles.booksContainer}>
            {books.map((book, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.SMInput, book.selected && { borderColor: '#548DFF' }]}
                onPress={() => {
                  const newBooks = [...books];
                  newBooks[index].selected = !newBooks[index].selected;
                  setBooks(newBooks);
                }}>
                <Text style={styles.bookText}>{book.name}</Text>
              </TouchableOpacity>
            ))}

            <TextInput
              style={styles.inputOther}
              placeholder="Other..."
              placeholderTextColor={'#000'}
              value={booksOther}
              onChangeText={(text) => setBooksOther(text)}
            />
          </View>

          <View style={styles.btnModalContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setModal1Visible(false)
              }}
            >
              <Text style={styles.saveBtnTxt}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModal1Visible(false)}
            >
              <Text style={styles.cancelBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Radio Channel & Music */}
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModal2Visible(true)}>
        <Text style={styles.input}>Radio Channel & Music</Text>
        <Entypo style={styles.icon} name="chevron-right" size={24} color="black" />
      </TouchableOpacity>

      {/* Radio Channel & Music - Modal */}
      <Modal animationType="slide" visible={modal2Visible}>
        <SafeAreaView style={styles.modal}>
          <Text style={styles.modalXSText}>Pick Radio Channel</Text>
          <View style={styles.doubleContainer}>
            {radioChannel.map((radioChannel) => (
              <TouchableOpacity
                key={radioChannel.id}
                style={[styles.XSInput, radioChannel.selected && { borderColor: '#548DFF' }]}
                onPress={() => {
                  const newRadioChannel = radioChannel.map((item) => {
                    if (item.id === radioChannel.id) {
                      return { ...item, selected: !item.selected };
                    }
                    return item;
                  });
                  setRadioChannel(newRadioChannel);
                }}>
                <Text style={styles.booksText}>{radioChannel.name}</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.inputOther}
              placeholder="Other..."
              placeholderTextColor={'#000'}
              value={radioChannelOther}
              onChangeText={(text) => setRadioChannelOther(text)}
            />
          </View>
          <Text style={styles.modalXSText}>Pick Music</Text>
          <View style={styles.doubleContainer}>
            {music.map((music) => (
              <TouchableOpacity
                key={music.id}
                style={[styles.XSInput, music.selected && { borderColor: '#548DFF' }]}
                onPress={() => {
                  const newMusic = music.map((item) => {
                    if (item.id === music.id) {
                      return { ...item, selected: !item.selected };
                    }
                    return item;
                  });
                  setMusic(newMusic);
                }}>
                <Text style={styles.booksText}>{music.name}</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.inputOther}
              placeholder="Other..."
              placeholderTextColor={'#000'}
              value={musicOther}
              onChangeText={(text) => setMusicOther(text)}
            />
          </View>

          <View style={styles.btnModalContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setModal2Visible(false)
              }}
            >
              <Text style={styles.saveBtnTxt}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModal2Visible(false)}
            >
              <Text style={styles.cancelBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Tv Shows & Movies */}
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModal3Visible(true)}>
        <Text style={styles.input}>Tv Shows & Movies</Text>
        <Entypo style={styles.icon} name="chevron-right" size={24} color="black" />
      </TouchableOpacity>

      {/* Tv Shows & Movies Modal*/}
      <Modal animationType="slide" visible={modal3Visible}>
        <View style={styles.modal}>
          <Text style={styles.modalTextSecondRow}>Pick Tv Shows </Text>
          <Text style={[styles.modalTextSecondRow, { marginBottom: 40 }]}>Abilities</Text>
          <View style={styles.TVContainer}>
            {tvShows.map((tvShows) => (
              <TouchableOpacity
                key={tvShows.id}
                style={[styles.TV, tvShows.selected && { borderColor: '#548DFF' }]}
                onPress={() => {
                  const newTvShows = tvShows.map((item) => {
                    if (item.id === tvShows.id) {
                      return { ...item, selected: !item.selected };
                    }
                    return item;
                  });
                  setTvShows(newTvShows);
                }}>
                <Text style={styles.booksText}>{tvShows.name}</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.inputOther}
              placeholder="Other..."
              placeholderTextColor={'#000'}
              value={tvShowsOther}
              onChangeText={(text) => setTvShowsOther(text)}
            />
          </View>
          <View style={styles.TVContainer}>
            {movies.map((movies) => (
              <TouchableOpacity
                key={movies.id}
                style={[styles.TV, movies.selected && { borderColor: '#548DFF' }]}
                onPress={() => {
                  const newMovies = movies.map((item) => {
                    if (item.id === movies.id) {
                      return { ...item, selected: !item.selected };
                    }
                    return item;
                  });
                  setMovies(newMovies);
                }}>
                <Text style={styles.booksText}>{movies.name}</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.inputOther}
              placeholder="Other..."
              placeholderTextColor={'#000'}
              value={moviesOther}
              onChangeText={(text) => setMoviesOther(text)}
            />
          </View>


          <View style={styles.btnModalContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setModal3Visible(false)
              }}
            >
              <Text style={styles.saveBtnTxt}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModal3Visible(false)}
            >
              <Text style={styles.cancelBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Food & Drink */}
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModal4Visible(true)}>
        <Text style={styles.input}>Food & Drink</Text>
        <Entypo style={styles.icon} name="chevron-right" size={24} color="black" />
      </TouchableOpacity>

      {/* Food & Drink Modal */}
      <Modal animationType="slide" visible={modal4Visible}>
        <View style={styles.modal}>
          <Text style={styles.modalText}>Pick Food</Text>
          <View style={styles.doubleContainer}>
            {food.map((food) => (
              <TouchableOpacity
                key={food.id}
                style={[styles.Food, food.selected && { borderColor: '#548DFF' }]}
                onPress={() => {
                  const newFood = food.map((item) => {
                    if (item.id === food.id) {
                      return { ...item, selected: !item.selected };
                    }
                    return item;
                  });
                  setFood(newFood);
                }}>
                <Text style={styles.booksText}>{food.name}</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.inputOther}
              placeholder="Other..."
              placeholderTextColor={'#000'}
              value={foodOther}
              onChangeText={(text) => setFoodOther(text)}
            />

          </View>

          <Text style={styles.modalText}>Pick Drink</Text>
          <View style={styles.doubleContainer}>
            {drink.map((drink) => (
              <TouchableOpacity
                key={drink.id}
                style={[styles.Food, drink.selected && { borderColor: '#548DFF' }]}
                onPress={() => {
                  const newDrink = drink.map((item) => {
                    if (item.id === drink.id) {
                      return { ...item, selected: !item.selected };
                    }
                    return item;
                  });
                  setDrink(newDrink);
                }}>
                <Text style={styles.booksText}>{drink.name}</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.inputOther}
              placeholder="Other..."
              placeholderTextColor={'#000'}
              value={drinkOther}
              onChangeText={(text) => setDrinkOther(text)}
            />
          </View>
          <View style={styles.btnModalContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setModal4Visible(false)
              }}
            >
              <Text style={styles.saveBtnTxt}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}
              onPress={() => setModal4Visible(false)}>
              <Text style={styles.cancelBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bed Time Routine */}
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModal5Visible(true)}>
        <Text style={styles.input}>Bed Time Routine</Text>
        <Entypo style={styles.icon} name="chevron-right" size={24} color="black" />
      </TouchableOpacity>

      {/* Bed Time Routine Modal */}
      <Modal animationType="slide" visible={modal5Visible}>
        <View style={styles.modal}>
          <Text style={styles.modalText}>Bed Night Routine</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.pickerInside}
              selectedValue={selectedNightHour}
              onValueChange={itemValue => setSelectedNightHour(itemValue)}
              itemStyle={styles.pickerItem}
            >
              {hours.map(hour => (
                <Picker.Item key={hour} label={hour} value={hour} />
              ))}
            </Picker>
          </View>
          <Text style={styles.modalText}>Bed After-Noon Routine</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.pickerInside}
              selectedValue={selectedAfterNoonNaps}
              onValueChange={itemValue => setSelectedAfterNoonNaps(itemValue)}
              itemStyle={styles.pickerItem}
            >
              {hours.map(hour => (
                <Picker.Item key={hour} label={hour} value={hour} />
              ))}
            </Picker>
          </View>

          <View style={styles.btnModalContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setModal5Visible(false)
              }}
            >
              <Text style={styles.saveBtnTxt}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}
              onPress={() => setModal5Visible(false)}>
              <Text style={styles.cancelBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Special Hobbies */}
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModal6Visible(true)}>
        <Text style={styles.input}>Special Hobbies</Text>
        <Entypo style={styles.icon} name="chevron-right" size={24} color="black" />
      </TouchableOpacity>

      {/* Special Hobbies Modal */}
      <Modal animationType="slide" visible={modal6Visible}>
        <View style={styles.modal}>
          <Text style={styles.modalText}>Pick Hobbies</Text>
          <View style={styles.FoodContainer}>
            {hobbies.map((hobbies) => (
              <TouchableOpacity
                key={hobbies.id}
                style={[styles.Food, hobbies.selected && { borderColor: '#548DFF' }]}
                onPress={() => {
                  const newHobbies = hobbies.map((item) => {
                    if (item.id === hobbies.id) {
                      return { ...item, selected: !item.selected };
                    }
                    return item;
                  });
                  setHobbies(newHobbies);
                }}>
                <Text style={styles.booksText}>{hobbies.name}</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.inputOther}
              placeholder="Other..."
              placeholderTextColor={'#000'}
              value={hobbiesOther}
              onChangeText={(text) => setHobbiesOther(text)}
            />
          </View>
          <View style={styles.btnModalContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setModal6Visible(false)
              }}
            >
              <Text style={styles.saveBtnTxt}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}
              onPress={() => setModal6Visible(false)}>
              <Text style={styles.cancelBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* Other info */}
      <TextInput
        style={styles.comments}
        placeholder="Other Relevant Information..."
        placeholderTextColor={'black'}
        onChangeText={setOther}
        value={other}
        multiline={true}
      />

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonBox}
          onPress={NavigateToNextLVL} >
          <Text style={styles.button}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    width: SCREEN_WIDTH * 1,
    alignItems: 'center',
  },
  btnModalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: SCREEN_WIDTH * 1,
    marginTop: 50,
  },
  doubleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: SCREEN_WIDTH * 1,
    marginTop: 20,
  },
  inputBox: {
    width: SCREEN_WIDTH * 0.9,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    padding: 10,
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  line: {
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    width: SCREEN_WIDTH * 1,
    marginVertical: 20,
  },
  header: {
    fontSize: 30,
    marginBottom: 20,
    fontFamily: 'Urbanist-Bold',
  },
  input: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Urbanist-SemiBold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 25,
    fontFamily: 'Urbanist-Bold',
    margin: 40,
  },
  modalXSText: {
    fontSize: 25,
    fontFamily: 'Urbanist-Bold',
    marginTop: 20,
  },
  saveButton: {
    width: SCREEN_WIDTH * 0.45,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#548DFF',
    borderWidth: 1.5,
    borderColor: '#548DFF',
    padding: 10,
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    width: SCREEN_WIDTH * 0.45,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#F5F8FF',
    borderWidth: 1.5,
    borderColor: '#548DFF',
    padding: 10,
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnTxt: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    color: '#fff',
  },
  cancelBtnTxt: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    color: '#548DFF',
  },
  comments: {
    height: 100,
    borderWidth: 1.5,
    paddingTop: 10,
    borderRadius: 16,
    borderColor: '#E6EBF2',
    padding: 10,
    marginVertical: 7,
    width: SCREEN_WIDTH * 0.9,
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    width: SCREEN_WIDTH * 1,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBox: {
    width: SCREEN_WIDTH * 0.9,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#548DFF',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Urbanist-Bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  booksContainer: {
    width: SCREEN_WIDTH * 0.95,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  booksText: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Urbanist',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SMInput: {
    width: SCREEN_WIDTH * 0.2275,
    height: 55,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  XSInput:{
    width: SCREEN_WIDTH * 0.3,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputOther: {
    width: SCREEN_WIDTH * 0.95,
    height: 55,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    padding: 10,
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontFamily: 'Urbanist',
    fontSize: 15,
  },
  modalTextSecondRow: {
    fontSize: 30,
    fontFamily: 'Urbanist-Bold',
  },
  TVContainer: {
    width: SCREEN_WIDTH * 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  FoodContainer: {
    width: SCREEN_WIDTH * 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pickerItem: {
    fontSize: Dimensions.get('window').height * 0.025,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Urbanist-Bold',
  },
  pickerInside: {
    width: Dimensions.get('window').width * 0.5,
  },
  pickerContainer: {
    width: Dimensions.get('window').width * 0.5,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
  },
});