import React, { useState, useRef, useEffect } from "react";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";

const Chatting = ({ teamId }) => {
  console.log("Current team ID:", teamId);
  const [messages, setMessages] = useState([
    { id: 1, sender: "other", text: `안녕하세요 ${teamId} 번 채팅방입니다` }
  ]);
  const [newMessage, setNewMessage] = useState(""); // 입력된 메시지 관리
  const textAreaRef = useRef(null); // 텍스트 영역 참조
  const chatContainerRef = useRef(null); // 채팅 메시지 영역 참조

  // 오늘 날짜 가져오기
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2); // 연도 뒤 두 자리
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 0부터 시작하므로 +1
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  // 메시지 추가 함수
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        { id: messages.length + 1, sender: "me", text: newMessage },
      ]);
      setNewMessage(""); // 입력창 초기화
    }
  };

  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "3vh"; // 높이 초기화

    const maxHeight = 50 * parseFloat(window.getComputedStyle(textarea).fontSize);
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`; // 최대 높이를 넘지 않도록 제한
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 줄바꿈 방지
      handleSendMessage(); // 메시지 전송
    }
  };

  // 새로운 메시지가 추가될 때마다 스크롤을 하단으로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]); // messages가 변경될 때마다 실행

  return (
    <div
      style={{
        paddingTop: "7.5vh",
        display: "flex",
        flexDirection: "column",
        height: "91.5vh",
        width: "79vw",
        backgroundColor: "white",
        overflowX: "hidden", // 가로 스크롤 방지
      }}
    >
      {/* 채팅 메시지 영역 */}
      <div
        ref={chatContainerRef}
        className="custom-scrollbar"
        style={{
          maxHeight: "90vh",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden", // 가로 스크롤 방지
          padding: "2vw",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 날짜 기준으로 선 */}
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

        {/* 동적으로 메시지 렌더링 */}
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.sender === "me" ? "flex-end" : "flex-start",
              backgroundColor:
                message.sender === "me" ? "#D6E6F5" : "#D9D9D9",
              color: "black",
              padding: "10px 15px",
              borderRadius: "20px",
              fontSize: "14px",
              marginBottom: "10px",
              maxWidth: "60%",
              position: "relative",
            }}
          >
            {message.text}
          </div>
        ))}
      </div>

      {/* 입력 영역 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1vw",
          paddingLeft: "3.5vw",
        }}
      >
        <div
          className="hang"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "73vw",
          }}
        >
          {/* 텍스트 입력 필드와 버튼을 감싸는 컨테이너 */}
          <div
            style={{
              height: "auto",
              display: "flex",
              alignItems: "center",
              border: "0.9px solid black",
              borderRadius: "20px",
              width: "100%",
              padding: "0.5vw",
            }}
          >
            {/* 첨부 버튼 */}
            <button
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <AiOutlinePaperClip size={28} />
            </button>

            <textarea
              ref={textAreaRef}
              placeholder="메시지를 입력하세요..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)} // 값 변경 핸들링
              onKeyDown={handleKeyDown} // Enter 키 처리
              onInput={handleInput} // 입력 시 높이 자동 조정
              style={{
                flex: 1,
                
                border: "none", // border 제거
                fontSize: "14px",
                outline: "none",
                overflowY: "hidden", // 세로 스크롤 숨기기
                height: "1vh", // 기본 높이
                resize: "none",
              }}
            />
            {/* 전송 버튼 */}
            <button
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              onClick={handleSendMessage}
            >
              <AiOutlineSend size={28} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
