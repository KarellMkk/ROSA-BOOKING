import { toLocaleString } from "core-js/fn/number/epsilon";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  Alert
} from "react-native";
import { CheckBox, Icon } from "react-native-elements";
import { Button } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [time, setTime] = useState([]);
  const stages = ["Introduction Call", "Technical Test", "Cultural Fit"];

  const TimeSlot = async () => {
    try {
      const response = await fetch("https://jsonkeeper.com/b/O6A8");
      const json = await response.json();
      setTime(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    TimeSlot();
  }, []);

  const DateTime = async () => {
    try {
      const response = await fetch(
        "https://staging-api.rosa.be/api/availabilities?from=2022-02-14T23:00:00.000Z&to=2022-02-21T23:00:00.000Z&motive_id=61eea350ddf6c500149ae2cb&is_new_patient=false&calendar_ids=61379ba159d4940022b6c928&state=open");
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    DateTime();
  }, []);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  let numColumns = "4";
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.section}>
          <Text
            style={[styles.textXL, styles.appTitleText, styles.textColor]}
            testID="heading"
          >
            Find Availability
          </Text>
          <View style={{ paddingTop: 15 }}>
            <Text style={[styles.textSm]}>
              Is this your first appointment with this practitioner?
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingTop: 10,
              justifyContent: "space-around",
            }}
          >
            <CheckBox
              center
              title="Yes"
              checkedColor="#6b1c02"
              textStyle={styles.textColor}
              containerStyle={{ width: "60%" }}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={check1}
              onPress={() => setCheck1(!check1)}
            />
            <CheckBox
              center
              title="No"
              checkedColor="#6b1c02"
              textStyle={styles.textColor}
              containerStyle={{ width: "60%" }}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={check2}
              onPress={() => setCheck2(!check2)}
            />
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text>Quel est la raison de votre visite?</Text>
          <SelectDropdown
            data={stages}
            dropdownStyle={styles.widthPicker}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item;
            }}
          />
        </View>
        <View style={{ paddingTop: 40, flexDirection: "row" }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <View>
              <FlatList
                data={data}
                numColumns={numColumns}
                keyExtractor={({ id }, index) => id}
                renderItem={({ item }) => {
                  const date = new Date(item.startAt);
                  let dateStart = date.toString();
                  const date2 = new Date(item.endAt);
                  let dateEnd = date2.toString();
                  return (
                    <View style={{ alignItems: "center", width: "25%" }}>
                      <Text style={{ fontSize: 12 }}>
                        {dateStart.substring(0, 10)}
                      </Text>
                      <Button
                        mode="contained"
                        onPress={() => console.log(dateStart.substring(0, 10))}
                      >
                        {dateStart.substring(16, 21)}
                      </Button>
                      {/* START OF SECOND FLATLIST TO FETCH AVAILABILITIES WITH TIME */}
                      <FlatList
                        data={time}
                        numColumns={numColumns}
                        keyExtractor={({ id }, index) => id}
                        renderItem={({ item }) => {
                          return (
                            <View>
                              <Button
                                mode="text"
                                onPress={() => console.log(item.First)}
                              >
                                {item.Second}
                              </Button>
                              <Button
                                mode="text"
                                onPress={() => console.log(item.First)}
                              >
                                {item.Third}
                              </Button>
                              <Button
                                mode="text"
                                onPress={() => console.log(item.First)}
                              >
                                {item.Fourth}
                              </Button>
                              <Button
                                mode="text"
                                onPress={() => console.log(item.First)}
                              >
                                {item.Fifth}
                              </Button>
                            </View>
                          );
                        }}
                      />
                      {/* END OF SECOND FLATLIST TO FETCH AVAILABILITIES WITH TIME */}
                      <Button
                        mode="contained"
                        onPress={() => console.log(dateEnd.substring(0, 10))}
                      >
                        {dateEnd.substring(16, 21)}
                      </Button>
                      

                      {/* <Text style={{paddingTop: 10}}>
                        Start {date2.toLocaleTimeString()}
                      </Text>
                      <Text>End {date.toLocaleTimeString()}</Text> */}
                    </View>
                  );
                }}
              />
              <View style={{paddingTop: 15, alignItems: 'center', width: '100%'}}> 
              <Button
                        mode="contained"
                        onPress={() => Alert.alert('Successfuly Booked')}
                      >
                        Book
                      </Button>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginVertical: 24,
    marginHorizontal: 12,
  },
  textSm: {
    fontSize: 15,
  },
  textMd: {
    fontSize: 18,
  },
  textLg: {
    fontSize: 24,
  },
  textXL: {
    fontSize: 48,
  },
  appTitleText: {
    paddingTop: 12,
    fontWeight: "500",
  },
  textColor: {
    color: "#6b1c02",
  },
  widthPicker: {
    width: "50%",
  },
});
