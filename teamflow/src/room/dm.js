import React from 'react';

const DM = ({ selectedItem, teamId }) => {
  console.log("Direct Message with", selectedItem, "for Team ID:", teamId);

  return (
    <div>
      <h2>DM with {selectedItem} for Team {teamId}</h2>
      {/* DM 관련 UI 구현 */}
    </div>
  );
};

export default DM;
