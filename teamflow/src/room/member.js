import React, { useState } from 'react';

const Member = ({ members }) => {
  const [showTeamMakePopup, setTeamMakePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [teamMembers, setTeamMembers] = useState(members);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterMembers(term);
  };

  const filterMembers = (term) => {
    // 여기에 검색 로직을 넣습니다. 예시로 이름으로 필터링.
    const results = members.filter((member) =>
      member.name.toLowerCase().includes(term.toLowerCase())
    );
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
            style={{ padding: '1vw', borderBottom: '1px solid #D9D9D9',marginBottom: '0.7vh', }} >
            <div
              style={{display: 'flex',alignItems: 'center',marginBottom: '1.5vh',
              }}
            >
              <div
                style={{ width: '1.5vw', height: '1.5vw', borderRadius: '50%', backgroundColor: member.color || 'gray', marginRight: '1vw',  }}
              ></div>
              <span style={{ fontWeight: 'bold', fontSize: '18px' }}> {member.name}
              </span>
            </div>
            <div style={{ fontSize: '15px', marginTop: '1vh', marginLeft: '4vw' }}>
              Email: {member.email}
            </div>
            <div style={{ fontSize: '15px', marginTop: '1vh', marginLeft: '4vw' }}>
              Position: {member.position}
            </div>
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
                      <div style={{ width: '1.5vw',height: '1.5vw', borderRadius: '50%',backgroundColor: member.color || 'gray',
              marginRight: '1vw', }} ></div>
               <span>{member.name}</span>
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
