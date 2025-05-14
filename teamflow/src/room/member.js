
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Member = ({ members }) => {
  const [showTeamMakePopup, setTeamMakePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [teamMembers, setTeamMembers] = useState(members);
  const [allUsers, setAllUsers] = useState([]); // 🔥 모든 사용자 저장
  const myUserId = localStorage.getItem('userId');
  const userColor = '#FFC0CB'; // 👉 실제 개인 색상 state에서 받아오도록 하면 좋아요

  useEffect(() => {
    if (showTeamMakePopup) {
      const token = localStorage.getItem("access_token");
      axios.get('/api/user/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log("✅ 전체 유저 목록:", response.data); // 🔍 콘솔 출력 추가

        setAllUsers(response.data || []);
      })
      .catch(error => {
        console.error("❌ 모든 사용자 불러오기 실패:", error);
      });
    }
  }, [showTeamMakePopup]);
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterMembers(term);
  };

  const filterMembers = (term) => {
    if (!term.trim()) {
      setSearchResults([]); // 입력 없으면 결과도 없음
      return;
    }
  
    const lowerTerm = term.toLowerCase();

    const results = allUsers.filter((user) => {
      const isAlreadyMember = teamMembers.some((member) => member.userId === user.userId);
      const matchesSearch = user.userId?.toLowerCase().includes(lowerTerm); // ✅ userId로 검색
      return !isAlreadyMember && matchesSearch;
    });
    
    setSearchResults(results);
  };
  

  const handleAddMember = (member) => {
    setTeamMembers((prevMembers) => [...prevMembers, member]);
    setSearchTerm(''); 
    setSearchResults([]); 
    setTeamMakePopup(false);
  };

  return (
    <div
      style={{paddingTop: '7.5vh',display: 'flex',flexDirection: 'column',
        height: '88vh',width: '76vw', backgroundColor: 'white',overflowX: 'hidden',
      }}
    >
      <div
        style={{  flexDirection: 'column',display: 'flex',alignItems: 'center', position: 'relative', }} >
          <div className="hang" style={{ justifyContent: 'flex-start', width: '100%' }}>
          <div style={{fontSize:'30px',paddingBottom:"1vh",marginRight:"1vw"}}>Members </div>
          <button className='close-button' onClick={() => setTeamMakePopup(true)}>+</button>
        </div>
        <hr
          style={{ width: '100%',  border: 'none', borderTop: '1px solid #D9D9D9',  margin: '0.2vw', }}
        />
      </div>
      <div
        style={{ overflowY: 'auto',maxHeight: '78vh', padding: '0.7vw',
        }} >
      {teamMembers?.map((member, index) => (
  <div
    key={index}
    style={{
      padding: '1vw',
      borderBottom: '1px solid #D9D9D9',
      marginBottom: '0.5vh',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.5vh',
      }}
    >
      {member.profile ? (
        <img
          src={member.profile}
          alt="profile"
          style={{
            width: '3vw',
            height: '3vw',
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: '1vw',
          }}
        />
      ) : (
        <div
          style={{
            width: '2.5vw',
            height: '2.5vw',
            borderRadius: '50%',
            backgroundColor: 'white',
            border: '2px solid black',
            marginRight: '1vw',
          }}
        ></div>
      )}
      <span style={{ fontWeight: 'bold', fontSize: '20px', paddingBottom:"1vh" }}>
        {member.username}
      </span>
    </div>
    <div style={{paddingBottom:"1vh",marginTop:"-1vh"}}>
    <div style={{ fontSize: '15px', marginLeft: '4.5vw' }}>
      Email: {member.email || '없음'}
    </div>
    <div style={{ fontSize: '15px', marginTop: '1vh', marginLeft: '4.5vw' }}>
      Position: {member.position || '없음'}
    </div></div>
  </div>
))}

      </div>
      {showTeamMakePopup && (
        <div className="popup-overlay">
          <div
            className="popup-content" style={{ width: '33vw', height: '50vh', backgroundColor: '#D6E6F5' }} >
            <div className="hang" style={{ justifyContent: 'flex-end', width: '100%' }}>
              <button
                onClick={() => setTeamMakePopup(false)}
                className="close-button"
                style={{ color: 'gray', fontSize: '18px' }}
              >
                X
              </button>
            </div>
            <div style={{ padding: '1vw', textAlign: 'center' }}>
              <input 
              className='input-name'
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="검색 할 id 를 입력해주세요"
                style={{
                  display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30.5vw', height: '5.8vh', borderRadius: '27px', fontSize:"13px"
                }}
              />
            </div>
            <div style={{backgroundColor: 'white',padding: '0.2vw',paddingBottom:"1vh", maxHeight: '34vh', overflowY: 'auto', scrollbarWidth: 'none', width:"31vw",height:"34vh",msOverflowStyle: 'none', borderRadius: '27px',  marginLeft: '1vw',}}>
              {searchResults.length > 0 ? (searchResults.map((member, index) => (
                 <div
                 key={index}
                 style={{
                  display: 'flex',justifyContent: 'space-between',padding: '1.3vw',}} >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
  {member.profile ? (
    <img
    src={member.profile ?? ''}
    alt="profile"
      style={{
        width: '1.5vw',
        height: '1.5vw',
        borderRadius: '50%',
        objectFit: 'cover',
        marginRight: '1vw',
      }}
    />
  ) : (
    <div
      style={{
        width: '1.5vw',
        height: '1.5vw',
        borderRadius: '50%',
        backgroundColor: '#d9d9d9',
        border: '2px solid black',
        marginRight: '1vw',
      }}
    ></div>
  )}
  <span>{member.username}</span>
</div>

               <button onClick={() => handleAddMember(member)}className="close-button"
                style={{ color: 'gray', fontSize: '18px' }} >+</button></div>
               ))) : (
               <div>No members found</div> )}
               </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Member;
