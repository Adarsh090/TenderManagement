import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Card, Button, FAB, IconButton } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

export default function UserView() {
  const [tenders, setTenders] = useState([]);
  const [filteredTenders, setFilteredTenders] = useState([]);
  const [selectedTender, setSelectedTender] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidSubmitted, setBidSubmitted] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchTenders();
    loadNotifications();
  }, []);

  // Fetch Tenders
  const fetchTenders = async () => {
    const querySnapshot = await getDocs(collection(db, "tenders"));
    const tenderList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTenders(tenderList);
    setFilteredTenders(tenderList);
    checkNewTenders(tenderList);
  };

  // Check for new tenders
  const checkNewTenders = async (tenderList) => {
    const today = moment().format("YYYY-MM-DD");
    const newTenders = tenderList.filter((tender) => tender.publishDate === today);

    if (newTenders.length > 0) {
      const newNotifications = newTenders.map((tender) => `New Tender Available: ${tender.name}`);
      setNotifications(newNotifications);
      await AsyncStorage.setItem("notifications", JSON.stringify(newNotifications));
    }
  };

  // Load notifications
  const loadNotifications = async () => {
    const storedNotifications = await AsyncStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  };

  // Submit bid
  const submitBid = async () => {
    if (!selectedTender || !bidAmount) {
      Alert.alert("Error", "Please enter a bid amount.");
      return;
    }

    const bidTime = moment().format("YYYY-MM-DD HH:mm:ss");
    await addDoc(collection(db, "bids"), {
      tenderId: selectedTender.id,
      companyName: "Your Company",
      bidTime,
      bidCost: parseFloat(bidAmount),
    });

    setBidSubmitted((prev) => ({ ...prev, [selectedTender.id]: true }));

    Alert.alert("Success", "Bid Submitted Successfully!");
    setBidAmount("");
    setSelectedTender(null); 
  };

  return (
    <View style={styles.container}>
      {/* Notification Icon */}
      <View style={styles.notificationIcon}>
        <IconButton
          icon="bell"
          size={30}
          color="#FFD700"
          onPress={() => setShowNotifications(!showNotifications)}
        />
      </View>

      {/* Notification Messages */}
      {showNotifications && notifications.length > 0 && (
        <View style={styles.notificationBox}>
          {notifications.map((msg, index) => (
            <Text key={index} style={styles.notificationText}>{msg}</Text>
          ))}
        </View>
      )}

      <Text style={styles.header}>Available Tenders</Text>

      <FlatList
        data={filteredTenders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animatable.View animation="fadeInUp">
            <TouchableOpacity onPress={() => setSelectedTender(item)}>
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    {/* Right Checkmark Icon for Submitted Bids */}
                    {bidSubmitted[item.id] && (
                      <IconButton icon="check-circle" size={25} color="#FFD700" />
                    )}
                  </View>
                  <Text style={styles.cardText}>State: {item.state}</Text>
                  <Text style={styles.cardText}>Published Date: {item.publishDate}</Text>
                  <Text style={styles.cardText}>Tender Value: ₹{item.turnover}</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </Animatable.View>
        )}
      />

      {/* Bid Section - Only Visible When Clicking a Tender */}
      {selectedTender && (
        <View style={styles.bidSection}>
          <Text style={styles.bidTitle}>Submit Your Bid for {selectedTender.name}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Bid Amount"
            keyboardType="numeric"
            value={bidAmount}
            onChangeText={setBidAmount}
          />
          <Button mode="contained" style={styles.submitButton} onPress={submitBid}>
            Submit Bid
          </Button>
        </View>
      )}

      <FAB style={styles.fab} icon="refresh" color="white" onPress={fetchTenders} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  notificationIcon: { position: "absolute", top: 10, right: 10 },
  notificationBox: { backgroundColor: "#333", padding: 10, borderRadius: 5, marginTop: 40 },
  notificationText: { color: "#FFD700", fontSize: 14 },
  header: { fontSize: 22, fontWeight: "bold", color: "#FFD700", marginBottom: 10 },
  card: { backgroundColor: "#1E1E1E", padding: 15, marginVertical: 5, borderRadius: 10 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 18, color: "#FFD700", fontWeight: "bold" },
  cardText: { fontSize: 14, color: "#A9A9A9" },
  bidSection: { marginTop: 20, padding: 15, backgroundColor: "#1E1E1E", borderRadius: 10 },
  bidTitle: { fontSize: 18, color: "#FFD700", marginBottom: 10 },
  input: { backgroundColor: "#FFF", padding: 10, borderRadius: 5, marginVertical: 5 },
  submitButton: { marginTop: 10, backgroundColor: "#FFD700" },
  fab: { position: "absolute", right: 20, bottom: 20, backgroundColor: "#FFD700" },
});
