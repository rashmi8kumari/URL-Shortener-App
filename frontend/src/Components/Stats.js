import React, { useState } from "react";

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
      localStorage.setItem('lastCode', code);
      localStorage.setItem('statsData', JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card p-4 shadow">
            <h3 className="text-center mb-4">📊 URL Statistics</h3>

            <form onSubmit={fetchStats}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter short code (e.g. abc123)"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Loading..." : "Get Stats"}
              </button>
            </form>

            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}

            {stats && (
              <div className="mt-4">
                <h5 className="text-success">🔍 Stats Found:</h5>
                <p><strong>Original URL:</strong> {stats.originalUrl}</p>
                <p><strong>Short URL:</strong>{" "}
                  <a href={stats.shortUrl} target="_blank" rel="noreferrer">
                    {stats.shortUrl}
                  </a>
                </p>
                <p><strong>Click Count:</strong> {stats.clickCount}</p>
                <p><strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
