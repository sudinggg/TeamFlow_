import React from 'react';

const Meeting = ({ selectedItem, teamId }) => {
  console.log("Meeting on", selectedItem, "for Team ID:", teamId);

  return (
    <div>
      <h2>Meeting on {selectedItem} for Team {teamId}</h2>
      {/* Meeting 관련 UI 구현 */}
    </div>
  );
};

export default Meeting;
