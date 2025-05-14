import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Meeting = ({ selectedItem, onSave, teamId }) => {
  const [title, setTitle] = useState(selectedItem?.title || ''); 
  const [content, setContent] = useState(selectedItem?.content || '');
  const isNew = selectedItem.isNew;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        handleSave(); // Ctrl+S 저장
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, content]);
  
  const handleUpdate = () => {
    const token = localStorage.getItem("access_token");
    const today = new Date().toISOString().split("T")[0];
  
    const requestBody = {
      title: title,
      startTime: today,
      endTime: today,
      color: "#D6E6F5",
      teamId: teamId,
      logText: content, // 이게 빠졌다면 추가해야 해요

    };
  
    console.log("🛠 PATCH로 수정 요청:", selectedItem?.logId, requestBody);
  
    axios.patch(`/api/meeting-logs/${selectedItem?.logId}`, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      console.log("✅ 회의록 수정 성공:", res.data);
      onSave(title, content);
    })
    .catch((err) => {
      console.error("❌ 회의록 수정 실패:", err);
    });
  };
  
  const handleSave = () => {
    const token = localStorage.getItem("access_token");
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // yyyy-MM-dd
  
    const requestBody = {
      teamId: teamId,
      title: title,
      logText: content,
      meetingDate: formattedDate
    };
  
    console.log("🔥 현재 토큰:", token);
    console.log("teamID는", teamId);
    console.log("🚀 requestBody:", requestBody); // 🔄 이제 선언 후에 찍자!
  
    axios.post("/api/meeting-logs", requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      console.log("✅ 회의록 저장 성공:", res.data);
      onSave(title, content); // UI 업데이트용 콜백
    })
    .catch((error) => {
      console.error("❌ 회의록 저장 실패:", error);
      if (error.response) {
        console.log("📡 응답 데이터:", error.response.data);
      } else if (error.request) {
        console.log("📭 요청은 갔지만 응답 없음:", error.request);
      } else {
        console.log("💥 요청 설정 중 오류:", error.message);
      }
    });
  };
  
  return (
    <div style={{
      paddingTop: "7.5vh", display: "flex", flexDirection: "column",
      height: "91.5vh", width: "76.5vw", backgroundColor: "white", overflowX: "hidden",
    }}>
      <div style={{ flexDirection: "column", display: "flex", alignItems: "center", position: "relative" }}>
        <div className="hang" style={{ justifyContent: "flex-start", width: "100%", paddingLeft: "2vw" }}>
          <div style={{ fontSize: "30px", paddingBottom: "1vh", marginRight: "1vw" }}>Meeting</div>
        </div>
        <hr style={{ width: "100%", border: "none", borderTop: "1px solid #D9D9D9", margin: "0.2vw" }} />
      </div>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="회의 제목을 입력하세요..."
          style={{
            width: "80vw", height: "3vh", fontSize: "20px", fontWeight: "bold",
            border: "none", outline: "none", padding: "10px", marginTop: "20px",
            backgroundColor: "#f5f5f5", borderRadius: "5px"
          }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="회의 내용을 입력하세요..."
          style={{
            width: "80vw", height: "62vh", fontSize: "16px", border: "none",
            outline: "none", padding: "10px", marginTop: "20px",
            backgroundColor: "#f5f5f5", borderRadius: "5px", resize: "none", overflowY: "auto"
          }}
        />
<div>
  {isNew ? (
    <button
      className='close-button'
      style={{
        justifyContent: "flex-end", width: "100%", paddingLeft: "66vw",
        fontSize: "30px", paddingTop: "1.5vh"
      }}
      onClick={handleSave}
    >
      save
    </button>
  ) : (
    <button
      className='close-button'
      style={{
        justifyContent: "flex-end", width: "100%", paddingLeft: "66vw",
        fontSize: "30px", paddingTop: "1.5vh"
      }}
      onClick={handleUpdate}
    >
      update
    </button>
  )}
</div>

      </div>
    </div>
  );
};

export default Meeting;
