import React, { useState, useEffect, useRef } from "react";
import { FiVideo, FiVideoOff, FiMic, FiMicOff } from "react-icons/fi";

const Call = ({ teamId }) => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [transcript, setTranscript] = useState("자막입니다. 성공할 수 있을까요... 모르겠어요.");
  const [recognition, setRecognition] = useState(null);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  // 비디오 토글 함수
  const toggleVideo = async () => {
    console.log("toggleVideo 호출됨, isVideoOn:", isVideoOn);

    if (isVideoOn) {
      // 비디오 끄기
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        console.log("비디오 스트림 중지됨");
      }
      setStream(null);
    } else {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert("카메라 사용이 지원되지 않는 브라우저입니다.");
          return;
        }
        console.log("getUserMedia 호출"); 

        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log("mediaStream 생성됨:", mediaStream);

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          console.log("비디오 태그에 스트림 연결됨");
          videoRef.current.play().catch((err) => {
            console.error("비디오 재생 실패:", err);
          });
        }
      } catch (err) {
        console.error("카메라 활성화 실패:", err);
        alert("카메라를 활성화하는데 실패했습니다. 권한을 확인해주세요.");
      }
    }
    setIsVideoOn((prev) => !prev);
  };

  // 오디오 토글 함수
  const toggleAudio = () => setIsAudioOn((prev) => !prev);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("브라우저에서 음성 인식을 지원하지 않습니다.");
      alert("음성 인식을 지원하지 않는 브라우저입니다.");
      return;
    }
  
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
  
    recognitionInstance.lang = "ko-KR"; // 한국어로 설정
    recognitionInstance.continuous = true; // 지속적 음성 감지
    recognitionInstance.interimResults = true; // 중간 결과 감지
  
    recognitionInstance.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";
  
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
  
      setTranscript(finalTranscript + interimTranscript || "음성을 인식 중입니다...");
    };
  
    recognitionInstance.onerror = (event) => {
      console.error("음성 인식 에러:", event.error);
      alert("음성 인식 중 문제가 발생했습니다.");
    };
  
    setRecognition(recognitionInstance);
  }, []);
  
  useEffect(() => {
    if (isAudioOn && recognition) {
      console.log("음성 인식 시작...");
      recognition.start();
    } else if (!isAudioOn && recognition) {
      console.log("음성 인식 중지...");
      recognition.stop();
    }
  }, [isAudioOn, recognition]);

  return (
    <div
      style={{
        paddingTop: "10vh",
        flexDirection: "column",
        height: "91.5vh",
        width: "79vw",
        backgroundColor: "white",
        overflowX: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* 비디오 화면 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: "10px",
          height: "62vh",
          width: "69vw",
          borderRadius: "10px",
        }}
      >
        {[1, 2, 3, 4].map((_, index) => (
          <div
            key={index}
            style={{
              backgroundColor: isVideoOn && index === 3 ? "transparent" : "#D9D9D9",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#000",
              borderRadius: "8px",
              overflow: "hidden",
              position: "relative",
              height: "100%",
              width: "100%",
              aspectRatio: "16 / 9", // 화면 비율 고정
            }}
          >
            {isVideoOn && index === 3 ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  fontSize: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                👤
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          width: "69vw",
          display: "flex",
          justifyContent: "flex-start",
          marginTop: "1vh",
          alignItems: "center",
          gap: "0.7vw",
        }}
      >
        <button
          onClick={toggleVideo}
          style={{
            backgroundColor: "#D6E6F5",
            border: "none",
            borderRadius: "5vw",
            width: "5vw",
            height: "5vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          {isVideoOn ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
        </button>
        <button
          onClick={toggleAudio}
          style={{
            backgroundColor: "#D9D9D9",
            border: "none",
            borderRadius: "5vw",
            width: "5vw",
            height: "5vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          {isAudioOn ? <FiMic size={20} /> : <FiMicOff size={20} />}
        </button>
      </div>

      <div
        style={{
          marginBottom: "1vh",
          height: "12vh",
          width: "69vw",
          backgroundColor: "#F1F1F1",
          borderRadius: "8px",
          padding: "10px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          color: "#555",
          fontSize: "16px",
          position: "fixed",
          bottom: "3vh",
        }}
      >
        {transcript}
      </div>
    </div>
  );
};

export default Call;
