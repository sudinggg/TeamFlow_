import React, { useEffect, useState } from "react";
import "../App.css"; // 스타일 파일

const File = ({ teamId }) => {
  const [teamFiles, setTeamFiles] = useState([]);

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("teamFiles")) || [];
    console.log("📂 불러온 localStorage 데이터:", storedFiles); // ✅ 디버깅 추가

    const filteredFiles = storedFiles.filter(file => String(file.teamId) === String(teamId));
    setTeamFiles(filteredFiles);
    console.log(`📂 teamId(${teamId})의 파일 목록:`, filteredFiles); // ✅ 디버깅 추가
  }, [teamId]);

  const fileIcons = {
    pdf: "📄",
    hwp: "📑",
    image: "🖼️",
    "application/pdf": "📄",
    "application/vnd.hancom.hwp": "📑",
    "image/jpeg": "🖼️",
    "image/png": "🖼️",
    folder: "📁",
  };

  return (
    <div
      style={{
        paddingTop: "7.5vh",
        display: "flex",
        flexDirection: "column",
        height: "88vh",
        width: "76vw",
        backgroundColor: "white",
        overflowX: "hidden",
      }}
    >
      <div style={{ flexDirection: "column", display: "flex", alignItems: "center", position: "relative" }}>
        <div className="hang" style={{ justifyContent: "flex-start", width: "100%", paddingLeft: "2vw" }}>
          <div style={{ fontSize: "30px", paddingBottom: "1vh", marginRight: "1vw" }}>File</div>
        </div>
        <hr style={{ width: "100%", border: "none", borderTop: "1px solid #D9D9D9", margin: "0.2vw" }} />
      </div>
      <div className="custom-scrollbar" style={{height:"80vh", maxHeight: "80vh",width:"76vw",overflowY: "auto",overflowX: "hidden", }}>
      <div className="file-grid">
        {teamFiles.length > 0 ? (
          teamFiles.map((file, index) => {
            const isBase64 = file.url.startsWith("data:");
            let downloadUrl = file.url;

            if (isBase64 && (file.type === "application/pdf" || file.type === "application/vnd.hancom.hwp")) {
              try {
                console.log(`📂 변환 중: ${file.name} (${file.type})`);
                const byteCharacters = atob(file.url.split(",")[1]);
                const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) =>
                  byteCharacters.charCodeAt(i)
                );
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: file.type });
                downloadUrl = URL.createObjectURL(blob);
                console.log("✅ 변환 완료:", downloadUrl);
              } catch (error) {
                console.error("❌ 변환 오류:", error);
              }
            }

            return (
              <div key={index} className="file-item">
                <span className="file-icon">{fileIcons[file.type] || "📦"}</span>

                {file.type.startsWith("image/") ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    style={{ width: "100px", height: "100px", borderRadius: "10px", objectFit: "cover", cursor: "pointer" }}
                    onClick={() => window.open(file.url, "_blank")}
                  />
                ) : (
                  <a href={downloadUrl} download={file.name} style={{ color: "#007BFF", fontWeight: "bold" }}>
                    📄 {file.name} 다운로드
                  </a>
                )}
              </div>
            );
          })
        ) : (
          <p>No files available for this team.</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default File;
