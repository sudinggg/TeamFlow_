import React from "react";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();

  // 🔹 사용자 정보 (실제 API에서 불러오거나, Context/Redux에서 가져올 수도 있음)
  const user = {
    name: "김수진",
    email: "user@naver.com",
    job: "프론트엔드",
    time: "10:00~18:00",
    image: "", // 프로필 이미지 URL
  };

  return (
    <div style={{ width: "50vw", margin: "5vh auto", textAlign: "center" }}>
      <h1>마이페이지</h1>
      <img
        src={user.image || "https://via.placeholder.com/150"} // 기본 이미지 설정
        alt="User Profile"
        style={{ width: "10vw", height: "10vw", borderRadius: "50%" }}
      />
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>직책: {user.job}</p>
      <p>근무시간: {user.time}</p>

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

export default MyPage;
