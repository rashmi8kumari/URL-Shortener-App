import React, { useState, useEffect } from "react";
import { getToken } from "../utils/auth";

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

    const token = getToken();

    try {
      const res = await fetch("http://localhost:5000/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ originalUrl: longUrl }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setShortUrl(data.shortUrl);
      localStorage.setItem("shortUrl", data.shortUrl);
      localStorage.setItem("lastCode", data.shortUrl.split("/").pop());
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
          <div className="card shadow p-4">
            <h3 className="text-center mb-4">🔗 URL Shortener</h3>
            <form onSubmit={handleShorten}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your long URL"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Shortening..." : "Shorten URL"}
              </button>
            </form>

            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}

            {shortUrl && (
              <div className="alert alert-primary mt-4 text-center">
                <strong>Short URL:</strong>{" "}
                <a href={shortUrl} target="_blank" rel="noreferrer">
                  {shortUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;


