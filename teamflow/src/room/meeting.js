import React, { useState, useEffect } from 'react';

const Meeting = ({ selectedItem, onSave }) => {
  const [title, setTitle] = useState(selectedItem?.title || ''); 
  const [content, setContent] = useState(selectedItem?.content || '');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        onSave(title, content);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, content, onSave]);

  return (
    <div style={{
      paddingTop: "7.5vh",display: "flex",flexDirection: "column",
      height: "91.5vh", width: "76.5vw",backgroundColor: "white",overflowX: "hidden", }}>
      <div style={{ flexDirection: "column", display: "flex", alignItems: "center", position: "relative" }}>
              <div className="hang" style={{ justifyContent: "flex-start", width: "100%", paddingLeft: "2vw"  }}>
              <div style={{ fontSize: "30px", paddingBottom: "1vh", marginRight: "1vw" }}>Meeting</div>
                 </div>
            <hr style={{ width: "100%", border: "none", borderTop: "1px solid #D9D9D9", margin: "0.2vw" }} />
      </div>
      <div >
        <div>
      <input type="text" value={title}
        onChange={(e) => setTitle(e.target.value)}  placeholder="회의 제목을 입력하세요..."
        style={{
          width: "80vw", height: "3vh", fontSize: "20px",fontWeight: "bold",
          border: "none",outline: "none",  padding: "10px", marginTop: "20px",backgroundColor: "#f5f5f5",borderRadius: "5px"
        }}
      /></div>
        <div> <textarea
        value={content} onChange={(e) => setContent(e.target.value)}
        placeholder="회의 내용을 입력하세요..."
        style={{ width: "80vw",height: "62vh", fontSize: "16px", border: "none",
          outline: "none",padding: "10px", marginTop: "20px",backgroundColor: "#f5f5f5", borderRadius: "5px",  resize: "none", overflowY: "auto"}}
      /></div>
      <div> 
      <button className='close-button' style={{justifyContent: "flex-end", width: "100%", paddingLeft: "66vw",fontSize:"30px",paddingTop:"1.5vh"}}
       onClick={() => onSave(title, content)} >save </button> 
      </div>
    </div>
    </div>
  );
};

export default Meeting;
