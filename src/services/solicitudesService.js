import { collection, getDocs, addDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/Confing";

const COLLECTION = "solicitudes";

export async function guardarSolicitud(solicitud) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...solicitud,
      creadoEn: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar la solicitud:", error);
    throw error;
  }
}

export async function obtenerSolicitudes() {
  try {
    const q = query(collection(db, COLLECTION), orderBy("creadoEn", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener las solicitudes:", error);
    throw error;
  }
}

export async function obtenerSolicitudesPorEmail(email) {
  try {
    const q = query(collection(db, COLLECTION), where("email", "==", email));
    const snapshot = await getDocs(q);
    const datos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return datos.sort((a, b) => (b.creadoEn || "").localeCompare(a.creadoEn || ""));
  } catch (error) {
    console.error("Error al buscar solicitudes por email:", error);
    throw error;
  }
}
