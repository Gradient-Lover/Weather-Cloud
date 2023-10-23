import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const cityInputRef = useRef();

  const fetchWeather = async (searchedCity) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=dae274a5b50d4ef09ac213234231005&q=${searchedCity}`
      );
      const data = await response.json();

      if (data.error) {
        Alert.alert("Invalid City Name", "Please enter a valid city name!");
      } else {
        setWeatherData(data);
        setCity("");
        setBackgroundColor(getRandomColor());

        setSearchHistory((prevHistory) => [
          ...prevHistory,
          {
            name: searchedCity,
            temperature: data.current.temp_c,
            condition: data.current.condition.text,
          },
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (index) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this search?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            setSearchHistory((prevHistory) =>
              prevHistory.filter((_, i) => i !== index)
            );
          },
        },
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear Confirmation",
      "Are you sure you want to clear the search history?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Clear",
          onPress: () => {
            setSearchHistory([]);
          },
        },
      ]
    );
  };

  const getRandomColor = () => {
    const colors = [
      "#FF5733",
      "#336DFF",
      "#33FF57",
      "#FF33E0",
      "#FFA833",
      "#3397FF",
      "#3339FF",
      "#AA33FF",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text>☁🌡🧊☀⛱☔💧🔥🌤</Text>
      <TextInput
        ref={cityInputRef}
        placeholder="Enter city name"
        value={city}
        onChangeText={(text) => {
          setCity(text);
        }}
        style={styles.input}
      />
      <Button title="Get Weather" onPress={() => fetchWeather(city)} />
      {weatherData && (
        <View style={styles.weatherInfo}>
          <Text>City: {weatherData.location.name}</Text>
          <Text>Temperature: {weatherData.current.temp_c}°C</Text>
          <Text>Condition: {weatherData.current.condition.text}</Text>
        </View>
      )}
      {searchHistory.length > 0 && (
        <View>
          <Text style={styles.historyTitle}>Search History</Text>

          <FlatList
            style={{ backgroundColor: "pink", height: 200, maxHeight: 200 }}
            data={searchHistory}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={({ item, index }) => (
              <View style={styles.historyItem}>
                <TouchableOpacity onPress={() => fetchWeather(item.name)}>
                  <Text style={styles.resubmitButton}>{item.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(index)}>
                  <Text style={styles.deleteButton}>X</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity onPress={handleClearHistory}>
            <Text style={styles.clearButton}>Clear </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 150,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    margin: 10,
    padding: 5,
  },
  weatherInfo: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  resubmitButton: {
    color: "blue",
    fontSize: 16,
  },
  deleteButton: {
    color: "red",
    fontSize: 16,
  },
  clearButton: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
});
