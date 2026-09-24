import Head from "next/head";
import { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Home() {
  const [form, setForm] = useState({
    type: "inondation",
    description: "",
    location: "",
    photo: null,
  });

  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSignalements();
  }, []);

  // Récupération sans orderBy (pour éviter l'erreur d'index Firestore)
  const fetchSignalements = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "signalements"));
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Tri du plus récent au plus ancien directement en JS
      docs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      
      setSignalements(docs);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
          setForm({ ...form, location: coords });
        },
        () => alert("Impossible d'accéder à la géolocalisation.")
      );
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.location) {
      alert("Veuillez remplir la description et indiquer la localité/GPS.");
      return;
    }

    setLoading(true);
    let photoUrl = "";

    try {
      if (form.photo) {
        const storageRef = ref(storage, `photos/${Date.now()}_${form.photo.name}`);
        const snapshot = await uploadBytes(storageRef, form.photo);
        photoUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "signalements"), {
        type: form.type,
        location: form.location,
        description: form.description,
        photoUrl: photoUrl,
        createdAt: new Date().toISOString()
      });

      alert("Signalement enregistré avec succès !");
      setForm({ type: "inondation", description: "", location: "", photo: null });
      fetchSignalements();
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Vigie Civique 🇨🇮</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header style={styles.header}>
        <h1>Vigie Civique 🇨🇮</h1>
        <p>Plateforme participative de prévention et de sécurité civique</p>
      </header>

      <section style={styles.card}>
        <h2>🚨 Signaler un risque</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Type de risque :</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            style={styles.input}
          >
            <option value="inondation">🌊 Inondation</option>
            <option value="zone_dangereuse">⚠️ Zone dangereuse</option>
            <option value="orpaillage">⛏️ Orpaillage clandestin</option>
          </select>

          <label style={styles.label}>📍 Localisation / GPS :</label>
          <div style={styles.row}>
            <input
              type="text"
              placeholder="Coordonnées ou commune"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              style={{ ...styles.input, flex: 1, marginBottom: 0 }}
            />
            <button type="button" onClick={handleGetLocation} style={styles.btnGps}>
              GPS 🎯
            </button>
          </div>

          <label style={styles.label}>📸 Photo + Description :</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
            style={styles.input}
          />
          <textarea
            placeholder="Décrivez brièvement la situation..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ ...styles.input, height: "80px" }}
          />

          <button type="submit" disabled={loading} style={styles.btnPrimary}>
            {loading ? "Envoi en cours..." : "Envoyer l'alerte"}
          </button>
        </form>
      </section>

      <section style={styles.card}>
        <h2>📋 Mes signalements</h2>
        {signalements.length === 0 ? (
          <p style={{ color: "#666" }}>Aucun signalement enregistré pour le moment.</p>
        ) : (
          signalements.map((s) => (
            <div key={s.id} style={styles.historyItem}>
              <strong>[{s.type?.toUpperCase()}]</strong> - {s.location}
              <p style={{ margin: "5px 0" }}>{s.description}</p>
              {s.photoUrl && (
                <a href={s.photoUrl} target="_blank" rel="noreferrer" style={{ color: "#0070f3", fontSize: "12px" }}>
                  📷 Voir la photo
                </a>
              )}
            </div>
          ))
        )}
      </section>

      <section style={styles.card}>
        <h2>🚔 Numéros d'urgence (Côte d'Ivoire)</h2>
        <div style={styles.emergencyGrid}>
          <a href="tel:170" style={styles.btnEmergency}>👮 Police : 170</a>
          <a href="tel:145" style={styles.btnEmergency}>🛡️ Gendarmerie : 145</a>
          <a href="tel:180" style={styles.btnEmergency}>🚒 Pompiers : 180</a>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "0 auto", padding: "15px", fontFamily: "Arial, sans-serif", backgroundColor: "#f4f6f8", minHeight: "100vh" },
  header: { textAlign: "center", marginBottom: "20px", color: "#111" },
  card: { backgroundColor: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "15px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
  form: { display: "flex", flexDirection: "column" },
  label: { fontWeight: "bold", marginTop: "10px", marginBottom: "5px", color: "#333" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "10px", fontSize: "14px" },
  row: { display: "flex", gap: "10px", marginBottom: "10px" },
  btnGps: { padding: "10px", border: "none", backgroundColor: "#0070f3", color: "#fff", borderRadius: "6px", cursor: "pointer" },
  btnPrimary: { padding: "12px", backgroundColor: "#e53e3e", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", marginTop: "10px" },
  historyItem: { padding: "10px", backgroundColor: "#edf2f7", borderRadius: "6px", marginBottom: "8px" },
  emergencyGrid: { display: "flex", flexDirection: "column", gap: "8px" },
  btnEmergency: { display: "block", textAlign: "center", padding: "10px", backgroundColor: "#2b6cb0", color: "#fff", textDecoration: "none", borderRadius: "6px", fontWeight: "bold" },
};
