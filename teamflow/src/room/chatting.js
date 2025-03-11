import React, { useState, useRef, useEffect } from "react";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";

const Chatting = ({ teamId }) => {

  console.log("채팅방 입장"); 

  const [messages, setMessages] = useState([
    { id: 1, sender: "other", text: `안녕하세요 ${teamId} 번 채팅방입니다` },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]); // 첨부된 파일 리스트
  const textAreaRef = useRef(null);
  const chatContainerRef = useRef(null);
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2); // 연도 뒤 두 자리
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 0부터 시작하므로 +1
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };
  // 파일 첨부 처리
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachedFiles([...attachedFiles, ...files]); // 기존 파일 유지하며 추가
  };

  // 선택한 파일 삭제 기능
  const removeFile = (index) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };
const MAX_STORAGE_SIZE = 4500 * 1024; // 최대 4.5MB까지만 사용
// 기존 코드에서 누락된 변수 추가
const MAX_LOCAL_STORAGE_SIZE = 4500 * 1024; // 최대 4.5MB

  function cleanOldFiles() {
      let storedFiles = JSON.parse(localStorage.getItem("teamFiles")) || [];
  
      while (JSON.stringify(storedFiles).length > MAX_STORAGE_SIZE) {
          console.log(`🗑 오래된 파일 삭제: ${storedFiles[0].name}`);
          storedFiles.shift(); // 가장 오래된 파일부터 삭제
      }
  
      localStorage.setItem("teamFiles", JSON.stringify(storedFiles));
      console.log("✅ 정리 후 localStorage 사용량:", JSON.stringify(storedFiles).length / 1024, "KB");
  }
  
  cleanOldFiles(); // 오래된 파일 정리 실행
  
  const handleSendMessage = async () => {
    console.log("🔥 handleSendMessage 실행됨!");

    if (newMessage.trim() === "" && attachedFiles.length === 0) {
        console.log("❌ 메시지와 파일이 모두 없음 → 저장 안 함!");
        return;
    }

    // ✅ Blob URL 생성 (Base64 대신 사용)
    const blobFiles = attachedFiles.map(file => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file), // Blob URL 사용
        teamId: teamId,
    }));

    // ✅ 기존 데이터 불러오기
    let storedFiles = JSON.parse(localStorage.getItem("teamFiles")) || [];

    // ✅ 저장 전에 크기 검사
    if (JSON.stringify([...storedFiles, ...blobFiles]).length > MAX_LOCAL_STORAGE_SIZE) {
        console.warn("🚨 저장 공간 부족! 파일을 정리해야 함!");
        cleanOldFiles(); // 용량 초과 시 오래된 파일 삭제
    }

    storedFiles = JSON.parse(localStorage.getItem("teamFiles")) || []; // 다시 불러오기
    const updatedFiles = [...storedFiles, ...blobFiles];

    // ✅ localStorage 저장
    localStorage.setItem("teamFiles", JSON.stringify(updatedFiles));

    console.log("📁 localStorage 저장됨!", updatedFiles);

    // ✅ **messages 상태 업데이트 (UI에 표시)**
    const newMessageData = {
        id: messages.length + 1,
        sender: "me",
        text: newMessage,
        files: blobFiles,
    };

    setMessages(prevMessages => [...prevMessages, newMessageData]); // 💡 UI 업데이트

    // ✅ 입력 필드 초기화
    setNewMessage("");
    setAttachedFiles([]); // 파일 초기화
};

  const handleKeyDown = (e) => {
    console.log("⌨️ 키 입력 감지됨:", e.key); // ✅ 모든 키 입력을 감지

    if (e.key === "Enter" && !e.shiftKey) { 
      e.preventDefault(); // 기본 엔터 줄바꿈 방지
      console.log("🚀 Enter 키 감지됨! handleSendMessage 호출!");

      handleSendMessage(); // 메시지 전송 함수 실행
    }
  };const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "3vh"; // 높이 초기화

    const maxHeight = 50 * parseFloat(window.getComputedStyle(textarea).fontSize);
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`; // 최대 높이를 넘지 않도록 제한
  };

  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      style={{
        paddingTop: "7.5vh",
        display: "flex",
        flexDirection: "column",
        height: "91.5vh",
        width: "79vw",
        backgroundColor: "white",
        overflowX: "hidden",
      }}
    >
      
      <div
        ref={chatContainerRef}
        className="custom-scrollbar"
        style={{
          maxHeight: "90vh",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "2vw",
          display: "flex",
          flexDirection: "column",
        }}
      >
           <div
          style={{
            flexDirection: "column",
            display: "flex",
            alignItems: "center",
            paddingBottom: "1vh",
            position: "relative",
          }}
        >
          <hr
            style={{
              width: "100%",
              border: "none",
              borderTop: "1px solid #D9D9D9",
              margin: "0.7vw",
            }}
          />
          <span
            style={{
              position: "absolute",
              backgroundColor: "white",
              padding: "0 1vh",
              fontSize: "14px",
              color: "#A0A0A0",
            }}
          >
            {getCurrentDate()}
          </span>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.sender === "me" ? "flex-end" : "flex-start",
              backgroundColor: message.sender === "me" ? "#D6E6F5" : "#D9D9D9",
              padding: "10px 15px",
              borderRadius: "20px",
              marginBottom: "10px",
              maxWidth: "60%",
              position: "relative",
            }}
          >          
    {message.files &&
  message.files.map((file, index) => {
    // ✅ Base64 파일인지 체크
    const isBase64 = file.url.startsWith("data:");

    // ✅ Base64 파일이면 Blob으로 변환하여 다운로드 가능하도록 처리
    const downloadUrl = isBase64
      ? (() => {
          const byteCharacters = atob(file.url.split(",")[1]);
          const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) =>
            byteCharacters.charCodeAt(i)
          );
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: file.type });
          return URL.createObjectURL(blob);
        })()
      : file.url;

    return (
      <div key={index} style={{ marginTop: "1vh" }}>
        {file.type.startsWith("image/") ? (
          // ✅ 이미지 파일은 그대로 표시
          <img
            src={file.url}
            alt="첨부 이미지"
            style={{ maxWidth: "90vw", maxHeight: "30vh", borderRadius: "10px" }}
          />
        ) : (
          // ✅ 문서 파일(PDF, HWP 등)은 다운로드 버튼 제공
          <a href={downloadUrl} download={file.name} style={{ color: "#007BFF", fontWeight: "bold" }}>
            📄 {file.name} 다운로드
          </a>
        )}
      </div>
    );
  })}


   {message.text}
          </div>
        ))}
      </div>

      {/* 첨부된 파일 미리보기 */}
      {attachedFiles.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "1vw",
            borderBottom: "1px solid #ccc",
            backgroundColor: "#f8f8f8",
          }}
        >
          {attachedFiles.map((file, index) => (
            <div key={index} style={{ position: "relative", margin: "5px" }}>
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="미리보기"
                  style={{ width: "80px", height: "80px", borderRadius: "10px", objectFit: "cover" }}
                />
              ) : (
                <span>{file.name}</span>
              )}
              {/* 삭제 버튼 */}
              <button
                onClick={() => removeFile(index)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
background: "transparent", // 완전 투명하게 설정
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "2vw",
                  height: "2vh",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 입력 영역 */}
      <div style={{ display: "flex", alignItems: "center", padding: "1vw", paddingLeft: "3.5vw" }}>
        <div style={{ display: "flex", alignItems: "center", width: "73vw" }}>
        <div style={{ display: "flex", alignItems: "center", border: "0.9px solid black", borderRadius: "20px", width: "80vw", padding: "0.5vw" }}>
<button style={{ border: "none", background: "transparent", cursor: "pointer", padding: "0 10px" }} onClick={() => document.getElementById("fileInput").click()}>
              <AiOutlinePaperClip size={24} />
 </button>
            <input id="fileInput" type="file" multiple onChange={handleFileChange} style={{ display: "none" }} />
            <textarea ref={textAreaRef} placeholder="메시지를 입력하세요..." value={newMessage} onKeyDown={handleKeyDown} onChange={(e) => setNewMessage(e.target.value)} style={{ flex: 1, border: "none", fontSize: "14px", outline: "none", overflowY: "hidden", resize: "none" }} />
            <button style={{ border: "none", background: "transparent", cursor: "pointer" }} onClick={handleSendMessage}>
              <AiOutlineSend size={28} />

            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
