import React, { useState} from "react";

function Stats() {
  const [code, setCode] = useState(localStorage.getItem('lastCode') || '');
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('statsData');
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStats = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStats(null);

    try {
      const res = await fetch(`http://localhost:5000/stats/${code}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStats(data);
      localStorage.setItem('lastCode', code); // save code
      localStorage.setItem('statsData', JSON.stringify(data)); // save stats
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>📊 URL Stats</h2>
      <form onSubmit={fetchStats} style={styles.form}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter short code (e.g. abc123)"
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Loading..." : "Get Stats"}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {stats && (
        <div style={styles.stats}>
          <p>
            <strong>Original URL:</strong> {stats.originalUrl}
          </p>
          <p>
            <strong>Short URL:</strong>{" "}
            <a href={stats.shortUrl} target="_blank" rel="noreferrer">
              {stats.shortUrl}
            </a>
          </p>
          <p>
            <strong>Click Count:</strong> {stats.clickCount}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(stats.createdAt).toLocaleString()}
          </p>
        </div>
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
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
  },
  error: { color: "red", marginTop: "10px" },
  stats: { marginTop: "20px", textAlign: "left" },
};

export default Stats;
