import React, { useEffect, useState } from "react";
import "../App.css"; // 스타일 파일

const File = ({ teamId }) => {
  const [teamFiles, setTeamFiles] = useState([]);

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("teamFiles")) || [];
    
    const filteredFiles = storedFiles.filter(file => String(file.teamId) === String(teamId));
    setTeamFiles(filteredFiles);
  }, [teamId]);

  const fileIcons = {
    pdf: "📄",
    image: "🖼️",
    "application/pdf": "📄",
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

      <hr className="separator" />
      <div className="file-grid">
        {teamFiles.length > 0 ? (
          teamFiles.map((file, index) => (
            <div key={index} className="file-item">
              <span className="file-icon">{fileIcons[file.type] || "📦"}</span>

              {file.type.startsWith("image/") ? (
                <img
                  src={file.url} // ✅ base64 이미지 직접 사용
                  alt={file.name}
                  style={{ width: "100px", height: "100px", borderRadius: "10px", objectFit: "cover", cursor: "pointer" }}
                  onClick={() => window.open(file.url, "_blank")}
                />
              ) : (
                <a href={file.url} download={file.name}>
                  {file.name}
                </a>
              )}
            </div>
          ))
        ) : (
          <p>No files available for this team.</p>
        )}
      </div>
    </div>
  );
};

export default File;
