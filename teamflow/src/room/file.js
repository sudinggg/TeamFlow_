import React from 'react';
import '../App.css'; // 스타일 파일

// 파일 데이터 예제
const files = [
  { id: 1, name: '문서.pdf', type: 'pdf', teamId: 1 },
  { id: 2, name: '사진.jpg', type: 'image', teamId: 1 },
  { id: 3, name: '보고서.hwp', type: 'hwp', teamId: 2 },
  { id: 4, name: '자료.pdf', type: 'pdf', teamId: 2 },
  { id: 5, name: '프로젝트', type: 'folder', teamId: 1 },
  { id: 6, name: '스크린샷.png', type: 'image', teamId: 2 },
];

const File = ({ teamId }) => {
  console.log("Team ID passed:", teamId); // teamId 확인
  console.log("Files data:", files); // files 배열 확인

  // 아이콘 매핑
  const fileIcons = {
    pdf: '📄',
    image: '🖼️',
    hwp: '📝',
    folder: '📁',
  };

  // teamId를 문자열로 변환하여 비교
  const teamFiles = files.filter((file) => String(file.teamId) === String(teamId));
  console.log("Filtered files:", teamFiles); // 필터링된 파일 목록 출력

  return (
    <div
      style={{
        paddingTop: '7.5vh',
        display: 'flex',
        flexDirection: 'column',
        height: '88vh',
        width: '76vw',
        backgroundColor: 'white',
        overflowX: 'hidden',
      }}
    >
      <div
        style={{
          flexDirection: 'column',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
          <div className="hang" style={{ justifyContent: 'flex-start', width: '100%' }}>
          <div style={{fontSize:'30px',paddingBottom:"1vh",marginRight:"1vw"}}>File </div>
        </div>
        <hr
          style={{
            width: '100%',
            border: 'none',
            borderTop: '1px solid #D9D9D9',
            margin: '0.2vw',
          }}
        />
      </div>
      <hr className="separator" />
      <div className="file-grid">
        {teamFiles.length > 0 ? (
          teamFiles.map((file) => (
            <div key={file.id} className="file-item">
              <span className="file-icon">{fileIcons[file.type] || '📦'}</span>
              <p>{file.name}</p>
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
