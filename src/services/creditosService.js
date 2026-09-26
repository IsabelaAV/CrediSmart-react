import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase/Confing";

const COLLECTION = "creditos";

export async function getCreditos() {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener los créditos:", error);
    throw error;
  }
}

export async function seedCreditos(creditosData) {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    if (snapshot.size > 0) return false;

    const ref = collection(db, COLLECTION);
    for (const credito of creditosData) {
      const { id, ...data } = credito;
      await addDoc(ref, data);
    }
    return true;
  } catch (error) {
    console.error("Error al sembrar los créditos:", error);
    throw error;
  }
}
