const fetchSignalements = async () => {
  try {
    // Récupération directe sans instruction 'orderBy' dans Firebase
    const querySnapshot = await getDocs(collection(db, "signalements"));
    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Tri des signalements du plus récent au plus ancien en JS
    docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setSignalements(docs);
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
  }
};
