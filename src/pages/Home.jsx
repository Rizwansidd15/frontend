import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Home = () => {
  const [items, setItems] = useState([]);
  const [likedMap, setLikedMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [likesCountMap, setLikesCountMap] = useState({});
  const [commentsCountMap, setCommentsCountMap] = useState({});
  const [savesCountMap, setSavesCountMap] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [commentInputMap, setCommentInputMap] = useState({});
  const [openCommentsFor, setOpenCommentsFor] = useState(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:3000/api/food", {
          credentials: "include",
        });
        const data = await res.json();
        const list = data.fooditems || [];
        setItems(list);
        const likes = {};
        const comments = {};
        const saves = {};
        list.forEach((it) => {
          likes[it._id] = it.likesCount || 0;
          comments[it._id] = it.commentsCount || 0;
          saves[it._id] = it.savesCount || 0;
        });
        setLikesCountMap(likes);
        setCommentsCountMap(comments);
        setSavesCountMap(saves);
      } catch (err) {
        console.error("Failed to load reels", err);
      }
    }
    load();
  }, []);

  async function toggleLike(foodId) {
    try {
      // optimistic update
      const prev = !!likedMap[foodId];
      setLikedMap((s) => ({ ...s, [foodId]: !prev }));
      setLikesCountMap((s) => ({
        ...s,
        [foodId]: (s[foodId] || 0) + (prev ? -1 : 1),
      }));

      await fetch("http://localhost:3000/api/food/like", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodId }),
      });
    } catch (err) {
      // rollback on error
      setLikedMap((s) => ({ ...s, [foodId]: !s[foodId] }));
      setLikesCountMap((s) => ({
        ...s,
        [foodId]: (s[foodId] || 0) + (likedMap[foodId] ? 1 : -1),
      }));
      console.error("Like action failed", err);
    }
  }

  async function toggleSave(foodId) {
    try {
      const prev = !!savedMap[foodId];
      setSavedMap((s) => ({ ...s, [foodId]: !prev }));
      setSavesCountMap((s) => ({
        ...s,
        [foodId]: (s[foodId] || 0) + (prev ? -1 : 1),
      }));

      await fetch("http://localhost:3000/api/food/save", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodId }),
      });
    } catch (err) {
      setSavedMap((s) => ({ ...s, [foodId]: !s[foodId] }));
      console.error("Save action failed", err);
    }
  }

  async function openComments(foodId) {
    setOpenCommentsFor(foodId);
    try {
      const res = await fetch(
        `http://localhost:3000/api/food/comments?foodId=${foodId}`,
        { credentials: "include" },
      );
      const data = await res.json();
      setCommentsMap((s) => ({ ...s, [foodId]: data.comments || [] }));
    } catch (err) {
      console.error("Failed to load comments", err);
      setCommentsMap((s) => ({ ...s, [foodId]: [] }));
    }
  }

  function closeComments() {
    setOpenCommentsFor(null);
  }

  async function postComment(foodId) {
    const text = (commentInputMap[foodId] || "").trim();
    if (!text) return;
    try {
      // optimistic append
      const temp = {
        _id: `temp-${Date.now()}`,
        text,
        user: { name: "You" },
        createdAt: new Date().toISOString(),
      };
      setCommentsMap((s) => ({ ...s, [foodId]: [temp, ...(s[foodId] || [])] }));
      setCommentsCountMap((s) => ({ ...s, [foodId]: (s[foodId] || 0) + 1 }));
      setCommentInputMap((s) => ({ ...s, [foodId]: "" }));

      const res = await fetch("http://localhost:3000/api/food/comment", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodId, text }),
      });
      const data = await res.json();
      if (data && data.comment) {
        setCommentsMap((s) => ({
          ...s,
          [foodId]: [
            data.comment,
            ...(s[foodId] || []).filter((c) => !c._id.startsWith("temp-")),
          ],
        }));
      }
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = entry.target.querySelector("video");
          if (!vid) return;
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        });
      },
      { threshold: [0.5] },
    );

    const reels = container.querySelectorAll(".reel");
    reels.forEach((r) => observer.observe(r));

    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="reels-container" ref={containerRef}>
      <button
        className="saved-nav"
        onClick={() => navigate("/saved")}
        aria-label="saved-page"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="#fff"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 2h12v18l-6-3-6 3V2z" />
        </svg>
      </button>
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

          <div className="reel-actions">
            <button
              className={`action-btn like-btn ${likedMap[item._id] ? "liked" : ""}`}
              onClick={() => toggleLike(item._id)}
              aria-label="like"
            >
              {likedMap[item._id] ? (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="#ff2d55"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 21s-7.5-4.35-9.5-7.09C-1.1 9.97 3.05 4 7.5 4 9.8 4 12 5.35 12 5.35S14.2 4 16.5 4C20.95 4 26.1 9.97 21.5 13.91 19.5 16.65 12 21 12 21z" />
                </svg>
              ) : (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="1.5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.8 8.6c0 6.4-8.8 11.2-8.8 11.2S3.2 15 3.2 8.6C3.2 5.6 5.4 3.4 8.4 3.4c1.8 0 3.2.9 4.4 2.1 1.2-1.2 2.6-2.1 4.4-2.1 3 0 5.2 2.2 5.2 5.2z" />
                </svg>
              )}
              <div className="action-count">{likesCountMap[item._id] || 0}</div>
            </button>

            <button
              className={`action-btn save-btn ${savedMap[item._id] ? "saved" : ""}`}
              onClick={() => toggleSave(item._id)}
              aria-label="save"
            >
              {savedMap[item._id] ? (
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="#fff"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 2h12v18l-6-3-6 3V2z" />
                </svg>
              ) : (
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="1.5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 2h12v18l-6-3-6 3V2z" />
                </svg>
              )}
            </button>
            <div className="action-count">{savesCountMap[item._id] || 0}</div>

            <button
              className="action-btn comment-btn"
              onClick={() => openComments(item._id)}
              aria-label="comments"
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="1.5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21 15a2 2 0 0 1-2 2H8l-5 3V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <div className="action-count">
              {commentsCountMap[item._id] || 0}
            </div>
          </div>

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
        </section>
      ))}

      {openCommentsFor && (
        <div className="comments-panel">
          <div className="comments-header">
            <button className="close-btn" onClick={closeComments}>
              Close
            </button>
          </div>
          <div className="comments-list">
            {(commentsMap[openCommentsFor] || []).map((c) => (
              <div className="comment-item" key={c._id}>
                <div className="comment-user">
                  {(c.user && c.user.name) || "User"}
                </div>
                <div className="comment-text">{c.text}</div>
              </div>
            ))}
          </div>
          <div className="comments-input">
            <input
              value={commentInputMap[openCommentsFor] || ""}
              onChange={(e) =>
                setCommentInputMap((s) => ({
                  ...s,
                  [openCommentsFor]: e.target.value,
                }))
              }
              placeholder="Write a comment..."
            />
            <button onClick={() => postComment(openCommentsFor)}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
