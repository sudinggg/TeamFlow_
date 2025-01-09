import React from 'react';

const File = ({ teamId }) => {
    console.log("Files for Team ID:", teamId);
  
    return (
      <div>
        <h2>Files for Team {teamId}</h2>
        {/* 실제 파일 UI 구현 */}
      </div>
    );
  };
  
  export default File;
  