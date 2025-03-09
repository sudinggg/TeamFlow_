import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import React, { useState, useRef, useEffect } from "react";

const DM = ({ selectedItem, teamId }) => {
  console.log("Direct 디엠창 with", selectedItem, "for Team ID:", teamId);
  const [messages, setMessages] = useState([
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

  // 메시지 전송
  const handleSendMessage = () => {
    if (newMessage.trim() !== "" || attachedFiles.length > 0) {
      const newMessageData = {
        id: messages.length + 1,
        sender: "me",
        text: newMessage,
        files: attachedFiles,
      };
      setMessages([...messages, newMessageData]);
      setNewMessage("");
      setAttachedFiles([]); // 파일 초기화
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { 
      e.preventDefault(); // 기본 엔터 줄바꿈 방지
      handleSendMessage(); // 메시지 전송 함수 실행
    }
  };const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "3vh"; // 높이 초기화

    const maxHeight = 50 * parseFloat(window.getComputedStyle(textarea).fontSize);
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`; // 최대 높이를 넘지 않도록 제한
  };

  useEffect(() => {
    if (selectedItem) {
      setMessages([]); // 기존 메시지 초기화
      setTimeout(() => {
        setMessages([
          { id: 1, sender: "other", text: `안녕하세요 ${teamId}번의 ${selectedItem}과의 채팅방입니다` },
        ]);
      }, 100); // React 상태 업데이트를 안정적으로 반영하기 위한 작은 딜레이 추가
    }
  }, [selectedItem, teamId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
          >            {message.files &&
              message.files.map((file, index) => (
                <div key={index} style={{ marginTop: "1vh" }}>
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="첨부 이미지"
                      style={{ maxWidth: "90vw", maxHeight: "30vh", borderRadius: "10px" }}
                    />
                  ) : (
                    <a href={URL.createObjectURL(file)} download={file.name} style={{ color: "#007BFF" }}>
                      {file.name}
                    </a>
                  )}
                </div>
              ))}
   {message.text}
          </div>
        ))}
      </div>
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
      <div style={{ display: "flex", alignItems: "center", padding: "1vw", paddingLeft: "3.5vw" }}>
        <div style={{ display: "flex", alignItems: "center", width: "73vw" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "0.9px solid black",
              borderRadius: "20px",
              width: "80vw",
              padding: "0.5vw",
            }}
          >
            <button
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: "0 10px",
              }}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <AiOutlinePaperClip size={24} />
            </button>
            <input
              id="fileInput"
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <textarea
              ref={textAreaRef}
              placeholder="메시지를 입력하세요..."
              value={newMessage}
              onKeyDown={handleKeyDown} 
               onInput={handleInput}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                fontSize: "14px",
                outline: "none",
                overflowY: "hidden",
                height: "1vh",
                resize: "none",
              }}
            />
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

export default DM;
