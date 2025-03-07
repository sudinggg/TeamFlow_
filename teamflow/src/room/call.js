import React, { useState, useEffect, useRef } from "react";
import { FiVideo, FiVideoOff, FiMic, FiMicOff } from "react-icons/fi";
import Swal from "sweetalert2"; 

const Call = ({ teamId }) => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [transcript, setTranscript] = useState("실시간 자막이 여기에 표시됩니다.");
  const [allTranscripts, setAllTranscripts] = useState([]); 
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const transcriptRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true; 
      recognition.interimResults = true;
      recognition.lang = "ko-KR"; 

      recognition.onresult = (event) => {
        let newTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          newTranscript += event.results[i][0].transcript; 
        }
        
        setTranscript(newTranscript); 
        setAllTranscripts((prev) => [...prev, newTranscript]);
      };

      recognitionRef.current = recognition;
    } else {
      alert("현재 브라우저에서는 음성 인식을 지원하지 않습니다.");
    }
  }, []);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [allTranscripts]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const toggleVideo = async () => {
    if (isVideoOn) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setStream(null);
    } else {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
      } catch (err) {
        console.error("카메라 활성화 실패:", err);
      }
    }
    setIsVideoOn((prev) => !prev);
  };

  const toggleAudio = () => {
    setIsAudioOn((prev) => !prev);

    if (!isAudioOn) {
      recognitionRef.current?.start(); 
    } else {
      recognitionRef.current?.stop();
    }
  };

  const showTranscriptPopup = () => {
    Swal.fire({
      title: "<h3 style='font-size: 20px; font-weight: bold; '>전체 자막 기록</h3>", 
      html: `<div style="max-height: 400px; overflow-y: auto; text-align: left; padding: 10px; font-size: 16px;">
                ${allTranscripts.join("<br>")}
             </div>`,
      confirmButtonText: "닫기",
      width: "40vw",heightAuto: false, confirmButtonColor: "#D9D9D9", 
      customClass: {
        popup: "custom-popup-class",
      },
    });
  };
  
  return (
    <div
      style={{paddingTop: "10vh",flexDirection: "column", height: "91.5vh", width: "79vw", backgroundColor: "white", overflowX: "hidden", display: "flex",alignItems: "center",}}
    >
      <div
        style={{display: "grid", gridTemplateColumns: "1fr 1fr",gridGap: "10px",
          height: "62vh", width: "69vw",borderRadius: "10px",
        }}
      >
        {[1, 2, 3, 4].map((_, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#D9D9D9",display: "flex", justifyContent: "center", alignItems: "center",
              color: "#000",borderRadius: "8px",overflow: "hidden",position: "relative",
              height: "100%",  width: "100%",
              aspectRatio: "16 / 9",
            }}
          >
            {isVideoOn && stream && index === 0 ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  fontSize: "50px", display: "flex", justifyContent: "center", alignItems: "center",
                }}
              >👤
              </div>
            )}
          </div>
        ))}
      </div>
      <div
        style={{
          width: "69vw",display: "flex", justifyContent: "flex-start",marginTop: "1vh",alignItems: "center", gap: "0.7vw",
        }}
      >
        <button
          onClick={toggleVideo}
          style={{  backgroundColor: "#D6E6F5",border: "none", borderRadius: "5vw", width: "5vw",
            height: "5vh",display: "flex",  justifyContent: "center", alignItems: "center",cursor: "pointer",
          }}
        >
          {isVideoOn ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
        </button>
        <button
          onClick={toggleAudio}
          style={{
            backgroundColor: isAudioOn ? "#00C853" : "#D9D9D9", border: "none", borderRadius: "5vw",
            width: "5vw",height: "5vh", display: "flex",justifyContent: "center",alignItems: "center",cursor: "pointer",
          }}
        >
          {isAudioOn ? <FiMic size={20} /> : <FiMicOff size={20} />}
        </button>
      </div>
      <div
        ref={transcriptRef} 
        style={{
          marginBottom: "1vh", height: "12vh",width: "69vw",backgroundColor: "#F1F1F1", borderRadius: "8px", padding: "10px", display: "flex",flexDirection: "column",
          alignItems: "flex-start",justifyContent: "flex-start",color: "#555", fontSize: "16px", position: "fixed", bottom: "3vh",cursor: "pointer",overflowY: "auto", maxHeight: "12vh",
        }}
        onClick={showTranscriptPopup} 
      >
        {allTranscripts.join(" ")}
      </div>
    </div>
  );
};

export default Call;
