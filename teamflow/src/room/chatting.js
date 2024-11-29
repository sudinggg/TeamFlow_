import React from 'react';

const Chatting = ({ teamId }) => {
  console.log("Current team ID:", teamId);  // teamId 출력

  return (
    <div>
      <h2>Chatting for Team {teamId}</h2>
      {/* 실제 채팅 UI 구현 */}
    </div>
  );
};

export default Chatting;
