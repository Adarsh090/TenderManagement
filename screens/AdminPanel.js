import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Alert } from "react-native";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Card, FAB, Button } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import * as Yup from "yup";
import moment from "moment";

export default function AdminPanel() {
  const [tenders, setTenders] = useState([]);
  const [tenderName, setTenderName] = useState("");
  const [description, setDescription] = useState("");
  const [publishDate, setPublishDate] = useState(moment().format("YYYY-MM-DD"));
  const [contractPeriod, setContractPeriod] = useState("");
  const [turnover, setTurnover] = useState("");
  const [experience, setExperience] = useState("");
  const [tenderValue, setTenderValue] = useState("");
  const [state, setState] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTenders();
  }, []);

  const tenderSchema = Yup.object().shape({
    tenderName: Yup.string().required(),
    description: Yup.string().required(),
    publishDate: Yup.string().required(),
    contractPeriod: Yup.string().required(),
    turnover: Yup.string().required(),
    experience: Yup.string().required(),
    tenderValue: Yup.string().required(),
    state: Yup.string().required(),
  });

  const addOrUpdateTender = async () => {
    try {
      await tenderSchema.validate({ tenderName, description, publishDate, contractPeriod, turnover, experience, tenderValue, state });

      const tenderData = {
        name: tenderName,
        description,
        publishDate,
        contractPeriod,
        turnover,
        experience,
        tenderValue,
        state,
      };

      if (isEditing) {
        // Update Tender
        await updateDoc(doc(db, "tenders", editId), tenderData);
        Alert.alert("Success", "Tender Updated Successfully!");
      } else {
        // Add New Tender
        const newTender = { id: `TND-${Date.now()}`, ...tenderData };
        await addDoc(collection(db, "tenders"), newTender);
        Alert.alert("Success", "Tender Created Successfully!");
      }

      fetchTenders();
      setShowForm(false);
      resetForm();
    } catch (err) {
      Alert.alert("Validation Error", err.message);
    }
  };

  const fetchTenders = async () => {
    const querySnapshot = await getDocs(collection(db, "tenders"));
    const tenderList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTenders(tenderList);
  };

  const deleteTender = async (tenderId) => {
    await deleteDoc(doc(db, "tenders", tenderId));
    Alert.alert("Deleted", "Tender has been removed.");
    fetchTenders();
  };

  const editTender = (tender) => {
    setTenderName(tender.name);
    setDescription(tender.description);
    setPublishDate(tender.publishDate);
    setContractPeriod(tender.contractPeriod);
    setTurnover(tender.turnover);
    setExperience(tender.experience);
    setTenderValue(tender.tenderValue);
    setState(tender.state);
    setEditId(tender.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setTenderName("");
    setDescription("");
    setPublishDate(moment().format("YYYY-MM-DD"));
    setContractPeriod("");
    setTurnover("");
    setExperience("");
    setTenderValue("");
    setState("");
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <View style={styles.container}>
      {!showForm ? (
        <>
          <Text style={styles.header}>Available Tenders</Text>
          <FlatList
            data={tenders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Animatable.View animation="fadeInUp">
                <Card style={styles.card}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                  <Text style={styles.cardText}>State: {item.state}</Text>
                  <Text style={styles.cardText}>Tender Value: ₹{item.tenderValue}</Text>
                  <Text style={styles.cardText}>Experience: {item.experience} years</Text>
                  <View style={styles.buttonContainer}>
                    <Button mode="contained" color="blue" onPress={() => editTender(item)}>
                      Edit
                    </Button>
                    <Button mode="contained" color="red" onPress={() => deleteTender(item.id)}>
                      Delete
                    </Button>
                  </View>
                </Card>
              </Animatable.View>
            )}
          />
        </>
      ) : (
        <View>
          <TextInput style={styles.input} placeholder="Tender Name" value={tenderName} onChangeText={setTenderName} />
          <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
          <TextInput style={styles.input} placeholder="Publish Date (YYYY-MM-DD)" value={publishDate} onChangeText={setPublishDate} />
          <TextInput style={styles.input} placeholder="Contract Period" value={contractPeriod} onChangeText={setContractPeriod} />
          <TextInput style={styles.input} placeholder="Turnover (₹)" value={turnover} onChangeText={setTurnover} />
          <TextInput style={styles.input} placeholder="Experience (Years)" value={experience} onChangeText={setExperience} />
          <TextInput style={styles.input} placeholder="Tender Value (₹)" value={tenderValue} onChangeText={setTenderValue} />
          <TextInput style={styles.input} placeholder="State" value={state} onChangeText={setState} />
          <Button mode="contained" style={styles.saveButton} onPress={addOrUpdateTender}>
            {isEditing ? "Update Tender" : "Save Tender"}
          </Button>
        </View>
      )}

      <FAB style={styles.fab} icon="plus" color="white" onPress={() => setShowForm(!showForm)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", color: "#FFD700", marginBottom: 10 },
  input: { backgroundColor: "#FFF", padding: 10, marginVertical: 5, borderRadius: 5 },
  card: { backgroundColor: "#1E1E1E", padding: 15, marginVertical: 5, borderRadius: 10 },
  cardTitle: { fontSize: 18, color: "#FFD700", fontWeight: "bold" },
  cardDesc: { fontSize: 14, color: "#FFF" },
  cardText: { fontSize: 14, color: "#A9A9A9" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  saveButton: { marginVertical: 10, backgroundColor: "#FFD700" },
  fab: { position: "absolute", right: 20, bottom: 20, backgroundColor: "#FFD700" },
});
