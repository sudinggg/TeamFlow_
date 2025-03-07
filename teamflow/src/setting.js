import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div style={{ width: "50vw", margin: "5vh auto", textAlign: "center" }}>
      <h1>설정</h1>

      {/* 다크 모드 설정 */}
      <div style={{ marginBottom: "2vh" }}>
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          다크 모드 활성화
        </label>
      </div>

      {/* 알림 설정 */}
      <div style={{ marginBottom: "2vh" }}>
        <label>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
          알림 받기
        </label>
      </div>

      {/* 홈으로 이동 버튼 */}
      <button
        style={{
          marginTop: "2vh",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "#007BFF",
          color: "white",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        홈으로 이동
      </button>
    </div>
  );
};

export default Setting;
