// src/room/member.js
import React from 'react';

const Member = ({ members }) => {
  return (
    <div>
      <h2>Team Members</h2>
      <ul>
        {members.map((member, index) => (
          <li key={index}>{member}</li>
        ))}
      </ul>
    </div>
  );
};

export default Member;
