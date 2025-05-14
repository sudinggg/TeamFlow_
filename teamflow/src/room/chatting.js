import React, { useState, useRef, useEffect } from "react";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const Chatting = ({ teamId,userId,senderName,teamMembers}) => {
  console.log("📡 WebSocket 주소 확인:", process.env.REACT_APP_BACKEND_URL);

  console.log("채팅방 입장"); 

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const stompClientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
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
  
  useEffect(() => {
    cleanOldFiles();
  }, []);

 useEffect(() => {
  const token = localStorage.getItem("access_token"); // ✅ 이걸로 변경
  console.log("🛂 accessToken 확인:", token); // 🔍 토큰 출력

  fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat/team/${teamId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("응답 실패");
      }
      return res.json();
    })
    .then((data) => {
      const loadedMessages = data.map((msg) => ({
        id: msg.id,
        sender: msg.senderId === userId ? "me" : "other",
        text: msg.content,
      }));
      setMessages(loadedMessages);
      localStorage.setItem(`team-${teamId}-messages`, JSON.stringify(loadedMessages));
    })
    .catch((err) => console.error("❌ 초기 메시지 불러오기 실패:", err));
}, [teamId, userId]);


  useEffect(() => {
    localStorage.setItem(`team-${teamId}-messages`, JSON.stringify(messages));
  }, [messages, teamId]);

  useEffect(() => {
    const socket = new SockJS(`${process.env.REACT_APP_BACKEND_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // 🔁 5초 간격 재시도
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("🟢 WebSocket 연결됨");
        setIsConnected(true);
        client.subscribe(`/topic/team/${teamId}`, (message) => {
          console.log("📥 수신된 메시지 전체:", message.body);
          const received = JSON.parse(message.body);
          console.log("📦 파싱된 메시지:", received);
          console.log("👤 받은 senderId:", received.senderId, "| 내 userId:", userId);
          
        
          // ✅ 내가 보낸 메시지는 무시
          if (received.senderId === userId) return;
        
          setMessages((prev) => [
            ...prev,
            { id: Date.now(), sender: "other", text: received.content },
          ]);
        });
      },
     
    });
    client.onStompError = (frame) => {
      console.error("❌ STOMP 오류:", frame.headers['message']);
      console.error("📄 상세:", frame.body);
    };
    
    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      console.log("🔌 WebSocket 연결 해제");
    };
  }, [teamId]);

  const handleSendMessage = () => {
    if (!isConnected) {
      console.warn("❌ 아직 WebSocket 연결 안됨!");
      return;
    }
      
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.warn("❌ STOMP 연결되지 않음!");
      return;
    }
  
    const chatMessage = {
      senderId: userId, 
      teamId: teamId,
      senderName: senderName || "익명",
      content: newMessage,
    };
  
    stompClientRef.current.publish({
      destination: `/app/team.sendMessage/${teamId}`,
      body: JSON.stringify(chatMessage),
    });
  
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "me", text: newMessage },
    ]);
    setNewMessage("");
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
