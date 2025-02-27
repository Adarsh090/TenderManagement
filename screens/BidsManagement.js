import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Card, Button, FAB, IconButton } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { Picker } from "@react-native-picker/picker";

export default function BidsManagement() {
  const [bids, setBids] = useState([]);
  const [filteredBids, setFilteredBids] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [selectedTender, setSelectedTender] = useState("");

  useEffect(() => {
    fetchBids();
    fetchTenders();
  }, []);

  // Fetch all Bids from Firestore
  const fetchBids = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "bids"));
      const bidList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      bidList.sort((a, b) => a.bidCost - b.bidCost); // Sort bids by cost (Ascending)
      setBids(bidList);
      setFilteredBids(bidList);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  // Fetch all Tenders from Firestore
  const fetchTenders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tenders"));
      const tenderList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTenders(tenderList);
    } catch (error) {
      console.error("Error fetching tenders:", error);
    }
  };

  // Delete a Bid
  const deleteBid = async (bidId) => {
    try {
      await deleteDoc(doc(db, "bids", bidId));
      Alert.alert("Deleted", "Bid has been removed.");
      fetchBids();
    } catch (error) {
      console.error("Error deleting bid:", error);
    }
  };

  // Filter Bids based on Selected Tender
  const filterBidsByTender = (tenderId) => {
    setSelectedTender(tenderId);
    if (tenderId === "") {
      setFilteredBids(bids);
    } else {
      const filtered = bids.filter((bid) => bid.tenderId === tenderId);
      setFilteredBids(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Bids Management</Text>
        <IconButton
          icon="refresh"
          color="#FFD700"
          size={28}
          onPress={fetchBids}
        />
      </View>

      {/* Tender Filter Dropdown */}
      <Picker
        selectedValue={selectedTender}
        style={styles.picker}
        onValueChange={(itemValue) => filterBidsByTender(itemValue)}
      >
        <Picker.Item label="All Tenders" value="" />
        {tenders.map((tender) => (
          <Picker.Item key={tender.id} label={tender.name} value={tender.id} />
        ))}
      </Picker>

      {/* Bids List */}
      <FlatList
        data={filteredBids}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animatable.View animation="fadeInUp">
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.cardTitle}>{item.companyName}</Text>
                <Text style={styles.cardText}>💰 Bid Amount: ₹{item.bidCost}</Text>
                <Text style={styles.cardText}>⏰ Bid Time: {item.bidTime}</Text>
                {item.isLastFiveMinutes && <Text style={styles.alert}>⚠️ Last 5 Minutes Bid</Text>}
                <Button mode="contained" color="red" onPress={() => deleteBid(item.id)}>Delete</Button>
              </Card.Content>
            </Card>
          </Animatable.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  headerContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  header: { fontSize: 22, fontWeight: "bold", color: "#FFD700", marginBottom: 10 },
  picker: { backgroundColor: "#FFF", marginVertical: 10, borderRadius: 5 },
  card: { backgroundColor: "#1E1E1E", padding: 15, marginVertical: 5, borderRadius: 10 },
  cardTitle: { fontSize: 18, color: "#FFD700", fontWeight: "bold" },
  cardText: { fontSize: 16, color: "#FFF" },
  alert: { fontSize: 14, color: "red", fontWeight: "bold" },
});
