import React from 'react';

const DMMain = ({ teamId, teamMembers, onSelectDM }) => {
  const lastMessages = {
  }

  return (
    <div style={{
      paddingTop: "7.5vh",display: "flex",flexDirection: "column",
      height: "91.5vh", width: "76.5vw",backgroundColor: "white",overflowX: "hidden", }}>
      <div style={{ flexDirection: "column", display: "flex", alignItems: "center", position: "relative" }}>
        <div className="hang" style={{ justifyContent: "flex-start", width: "100%", paddingLeft: "2vw"  }}>
          <div style={{ fontSize: "30px", paddingBottom: "1vh", marginRight: "1vw" }}>DM</div>
        </div>
        <hr style={{ width: "100%", border: "none", borderTop: "1px solid #D9D9D9", margin: "0.2vw" }} />
      </div>

      {teamMembers.length === 0 ? (
        <p style={{ textAlign: "center", color: "gray", marginTop: "20px" }}>팀원이 없습니다.</p>
      ) : (
        teamMembers.map((member) => (
          <div
            key={member.name}
            onClick={() => onSelectDM(member)}
            style={{
              cursor: "pointer",
              padding: "15px 20px",
              borderBottom: "1px solid #ccc",
              transition: "background 0.2s ease-in-out",
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>{member.name}</div>
            <div style={{ fontSize: "14px", color: "gray" }}>
              {lastMessages[member.name] || "최근 메시지가 없습니다."}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DMMain;
