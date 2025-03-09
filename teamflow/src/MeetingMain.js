import React from 'react';

const MeetingMain = ({ meetingRecords, onSelectMeeting, onNewMeeting }) => {
    return ( 
    <div style={{
        paddingTop: "7.5vh",display: "flex",flexDirection: "column",
        height: "91.5vh", width: "76.5vw",backgroundColor: "white",overflowX: "hidden", }}>
              <div style={{ flexDirection: "column", display: "flex", alignItems: "center", position: "relative" }}>
              <div className="hang" style={{ justifyContent: "flex-start", width: "100%", paddingLeft: "2vw"  }}>
              <div style={{ fontSize: "30px", paddingBottom: "1vh", marginRight: "1vw" }}>Meeting</div>
              <button className='close-button'
              onClick={() => {
              if (onNewMeeting) { onNewMeeting();   } else {
                console.error("onNewMeeting 함수가 전달되지 않았습니다."); } }} >
            + </button>        </div>
            <hr style={{ width: "100%", border: "none", borderTop: "1px solid #D9D9D9", margin: "0.2vw" }} />
      </div>
        {meetingRecords.length === 0 ? (
          <p style={{ textAlign: "center", color: "gray", marginTop: "20px" }}>저장된 회의록이 없습니다.</p>
        ) : (
          meetingRecords.map((record) => (
            <div
              key={record.title}
              onClick={() => onSelectMeeting(record.title)}
              style={{
                cursor: "pointer",
                padding: "15px 20px",
                borderBottom: "1px solid #ccc",
                transition: "background 0.2s ease-in-out"
              }} >
              <div style={{ fontSize: "18px", fontWeight: "bold" }}>{record.title}</div>
              <div style={{ fontSize: "14px", color: "gray" }}>
                {record.content.slice(0, 30)}...
              </div>
            </div>
          ))
        )}
      </div>
    );
  };
  
  export default MeetingMain;
  