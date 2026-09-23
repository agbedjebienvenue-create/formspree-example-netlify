import Head from "next/head";

export default function Home() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", textAlign: "center" }}>
      <Head>
        <title>Vigie Civique 🇨🇮</title>
      </Head>

      <main>
        <h1>Vigie Civique 🇨🇮</h1>
        <p>Plateforme de signalement et de suivi civique.</p>
      </main>
    </div>
  );
}
