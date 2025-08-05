import React, { useState, useEffect } from "react";
import { getToken } from "../utils/auth"; // utility to fetch token

function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem("shortUrl");
    if (savedUrl) setShortUrl(savedUrl);
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");

    const token = getToken(); // Get token from localStorage

    try {
      const res = await fetch("http://localhost:5000/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // attach token here
        },
        body: JSON.stringify({ originalUrl: longUrl }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setShortUrl(data.shortUrl);
      localStorage.setItem("shortUrl", data.shortUrl);
      localStorage.setItem("lastCode", data.shortUrl.split("/").pop()); // extract short code for stats page
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>🔗 URL Shortener</h1>
      <form onSubmit={handleShorten} style={styles.form}>
        <input
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Enter your long URL"
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
      {shortUrl && (
        <p style={styles.result}>
          Short URL:{" "}
          <a href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    paddingTop: "50px",
    textAlign: "center",
  },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  input: { padding: "10px", fontSize: "16px" },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
  },
  error: { color: "red", marginTop: "10px" },
  result: { marginTop: "20px", fontSize: "18px" },
};

export default Home;

