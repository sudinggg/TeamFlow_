import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Chatting from './room/chatting';
import TeamCalendar from './room/teamcalendar';
import Meeting from './room/meeting';
import DM from './room/dm';
import File from './room/file';
import Member from './room/member';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';

const Room = () => {
  const { teamId } = useParams(); 
  const [activeSection, setActiveSection] = useState('chatting');
  const [dropdowns, setDropdowns] = useState({
    dm: false,
    meeting: false,
  });
  const [activeDropdownItem, setActiveDropdownItem] = useState(null);


  const teams = [
    { id: '1', name: '수진이짱', color: 'red', member: ['수진이팀원', '수진팀원2'] },
    { id: '2', name: 'TeamFlow', color: 'blue', member: ['팀플로우 팀원1', '팀플로우 팀원2'] },
    { id: '3', name: 'Ewootz', color: 'green', member: ['이웃즈 팀원1', '이웃즈 팀원 2'] },
  ];

  const userId = 'sujin';  
  const team = teams.find((team) => team.id === teamId);  

  if (!team) {
    return <div>팀을 찾을 수 없습니다.</div>;
  }

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setDropdowns({ dm: false, meeting: false });
  };

  const toggleDropdown = (section) => {
    setDropdowns((prev) => ({
      ...prev,
      [section]: !prev[section], 
    }));
  };

  const handleDropdownItemClick = (section, item) => {
    setActiveSection(`${section}_${item}`);  // 클릭한 항목의 섹션과 아이템 정보 저장
    setActiveDropdownItem(item); // 선택된 li 항목 업데이트
  };

  const meetingItems = ['2024.11.07', '2024.11.14'];
  const dmItems = ['Sudding', 'Yevvon'];

  return (
    <div style={{ display: 'flex' }}>
      <div
        className="blue-box"
        style={{ height: '100vh', width: '19vw', borderRadius: '0px', float: 'left' }}
      >
        <div className="hang" style={{ top:'-2vh' ,position: 'relative', height:'8vh', paddingRight: '4.5vw' }}>
          <div
            className="input-name" style={{ height: '5.5vh',
              width: '2.3vw',    borderRadius: '10px',   backgroundColor: team.color || 'transparent',
              marginRight: '1vw',  }}
          ></div><h1 style={{fontSize:'27px',paddingBottom:'0.5vh'}}>{team.name}</h1>
        </div>
        <div style={{ height: '2vh' }}></div>
        <div
          style={{ height: '77vh', display: 'flex', flexDirection: 'column',alignItems: 'center', }}
        >
          <div>
            <button
              className="input-name"
              style={{
                width: '19vw',
                fontSize:'18px',
                height: '5vh',
                marginBottom: '1vh',
                backgroundColor: '#D6E6F5',
                color: activeSection === 'chatting' ? 'black' : 'gray',
              }}
              onClick={() => handleSectionChange('chatting')}
            >
              Chatting
            </button>
          </div>
          <div>
            <button
              className="input-name"
              style={{
                width: '19vw',
                height: '5vh',
                marginBottom: '1vh',fontSize:'18px',
                backgroundColor: '#D6E6F5',
                color: activeSection === 'teamcalendar' ? 'black' : 'gray',
              }}
              onClick={() => handleSectionChange('teamcalendar')}
            >
              TeamCalendar
            </button>
          </div>
          <div>
            <button
              className="input-name"
              style={{
                width: '10vw',
                height: '5vh',
                borderRadius:'0px',
                marginBottom: '1vh',
                backgroundColor: '#D6E6F5',
                color: activeSection.startsWith('meeting') ? 'black' : 'gray',
                borderBottom: dropdowns.meeting ? '0.5px solid gray' : 'none', 
                display: 'flex',  
                justifyContent: 'space-between',  
                alignItems: 'center', 
              }}
              onClick={() => toggleDropdown('meeting')}
            >
              <div style={{paddingLeft:'2vw',fontSize:'17px'}}>Meeting</div> 
  <div style={{ marginLeft: '2vw', marginTop: '4px' }}> 
    {dropdowns.meeting ? <MdArrowDropDown /> : <MdArrowDropUp />}
  </div>
            </button>
            {dropdowns.meeting && (
              <ul style={{     textAlign: 'center', listStyleType: 'none', 
             marginTop: '0.5vh', marginLeft: '1vw', maxHeight: '20vh', overflowY: 'auto',  padding: 0,}}>
                {meetingItems.map((item) => (
                  <li
                    key={item}
                    onClick={() => handleDropdownItemClick('meeting', item)}
                    style={{
                      color: activeDropdownItem === item ? 'black' : 'gray', 
                      fontWeight: activeDropdownItem === item ? 'bold' : 'normal', 

                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <button
              className="input-name"
              style={{
                width: '10vw',
                height: '5vh',
                borderRadius:'0px',
                marginBottom: '1vh',
                backgroundColor: '#D6E6F5',
                color: activeSection.startsWith('dm') ? 'black' : 'gray',
                borderBottom: dropdowns.dm ? '0.5px solid gray' : 'none', 
                display: 'flex',  
                justifyContent: 'space-between',  
                alignItems: 'center', 
              }}
              onClick={() => toggleDropdown('dm')}
            >
                <div style={{paddingLeft:'3vw',fontSize:'17px'}}>DM</div>  
    <div style={{ marginLeft: '3.2vw', marginTop: '4px' }}> 
      {dropdowns.dm ? <MdArrowDropDown /> : <MdArrowDropUp />}
    </div>


            </button>
            {dropdowns.dm && (
              <ul style={{   textAlign: 'center',listStyleType: 'none', marginTop: '0.5vh', marginLeft: '1vw', maxHeight: '20vh', overflowY: 'auto', padding: 0,}}>
                {dmItems.map((item) => (
                  <li
                    key={item}
                    onClick={() => handleDropdownItemClick('dm', item)}
                    style={{
                      color: activeDropdownItem === item ? 'black' : 'gray',  
                      fontWeight: activeDropdownItem === item ? 'bold' : 'normal', 
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <button
              className="input-name"
              style={{
                width: '19vw',
                height: '5vh',
                marginBottom: '1vh',
                backgroundColor: '#D6E6F5'
                ,fontSize:'18px',
                color: activeSection === 'file' ? 'black' : 'gray',
              }}
              onClick={() => handleSectionChange('file')}
            >
              File
            </button>
          </div>
        </div>

        <div>
          <button
            className="input-name"
            style={{
              borderRadius:'70px',
              padding:0,
              width: '2.7vw',
              height: '5vh',
              backgroundColor: activeSection === 'member' ? '#8A8A8A' : '#D9D9D9',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center', // 내용이 버튼의 중앙에 오도록 설정
              transition: 'background-color 0.3s ease', 
              left:'-5vw',
              color: activeSection === 'member' ? 'white' : 'white',
            }}
            onClick={() => handleSectionChange('member')}
          >
           <div style={{color:'black'}}>M</div> 
          </button>
       
        </div>
      </div>

      <div
        className="blue-box"
        style={{
          height: '100vh',
          width: '81vw',
          borderRadius: '0px',
          backgroundColor: 'white',
        }}
      >
        {activeSection === 'chatting' && <Chatting teamId={team.id} />}
        {activeSection === 'teamcalendar' && <TeamCalendar teamId={team.id} userId={userId} />}
        {activeSection.startsWith('dm') && <DM selectedItem={activeSection.split('_')[1]} teamId={team.id} />}
        {activeSection.startsWith('meeting') && <Meeting selectedItem={activeSection.split('_')[1]} teamId={team.id} />}
        {activeSection === 'file' && <File teamId={team.id} />}
             {activeSection === 'member' && <Member members={team.member} />} {/* Member 컴포넌트 렌더링 */}

      
      </div>
    </div>
  );
};

export default Room;
