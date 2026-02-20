import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Saved = () => {
  const [items, setItems] = useState([]);
  const [likesCountMap, setLikesCountMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("https://backend2-xw64.onrender.com/api/food/saved", {
          credentials: "include",
        });
        const data = await res.json();
        const list = data.foods || [];
        setItems(list);
        const counts = {};
        list.forEach((it) => (counts[it._id] = it.likesCount || 0));
        setLikesCountMap(counts);
      } catch (err) {
        console.error("Failed to load saved reels", err);
      }
    }
    load();
  }, []);

  if (!items.length)
    return (
      <div style={{ padding: 20, color: "#fff" }}>No saved reels yet.</div>
    );

  return (
    <div className="reels-container">
      {items.map((item) => (
        <section className="reel" key={item._id}>
          <video
            src={item.video}
            playsInline
            muted
            loop
            className="reel-video"
            controls={false}
          />

          <div className="reel-overlay">
            <div className="reel-description">
              {item.description || item.name}
            </div>
            <button
              className="visit-store"
              onClick={() => {
                const id =
                  item.foodPartner &&
                  (item.foodPartner._id || item.foodPartner);
                if (!id) return;
                navigate(`/profile/${id}`);
              }}
            >
              Visit Store
            </button>
          </div>

          <div
            className="saved-meta"
            style={{
              position: "absolute",
              right: 16,
              bottom: 24,
              color: "#fff",
            }}
          >
            <div style={{ textAlign: "center" }}>Likes</div>
            <div style={{ textAlign: "center", fontWeight: 600 }}>
              {item.likesCount || likesCountMap[item._id] || 0}
            </div>
            <div style={{ height: 8 }} />
            <div style={{ textAlign: "center" }}>Comments</div>
            <div style={{ textAlign: "center", fontWeight: 600 }}>
              {item.commentsCount || 0}
            </div>
            <div style={{ height: 8 }} />
            <div style={{ textAlign: "center" }}>Saves</div>
            <div style={{ textAlign: "center", fontWeight: 600 }}>
              {item.savesCount || 0}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Saved;
