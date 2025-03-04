import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Chatting from './room/chatting';
import TeamCalendar from './room/teamcalendar';
import Meeting from './room/meeting';
import DM from './room/dm';
import File from './room/file';
import Call from './room/call';
import Member from './room/member';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import { FiPhone } from 'react-icons/fi'; 

const Room = () => {
  const { teamId } = useParams(); 


  const [activeSection, setActiveSection] = useState('chatting');
  const [dropdowns, setDropdowns] = useState({
    dm: false,
    meeting: false,
  });
  const [showUserPopup, setShowUserPopup] = useState(false); 
  const [userImage, setUserImage] = useState(''); 
  const [username, setUsername] = useState('김수진');
  const [useremail, setUserEmail] = useState('user@naver.com');
  const [userjob, setUserjob] = useState('프론트엔드');
  const [usertime, setUserTime] = useState('10:00~18:00');
  const [activeDropdownItem, setActiveDropdownItem] = useState(null);


const teams = [
  {
    id: "1",
    name: "수진이짱",
    color: "red",
    members: [
      { name: "수진이팀원1", email: "team1@example.com", position: "Developer", color: "#FF5733" },
      { name: "수진팀원2", email: "team2@example.com", position: "Designer", color: "#33A1FF" },
      { name: "수진팀원3", email: "team3@example.com", position: "Manager", color: "#28A745" },
      { name: "수진팀원4", email: "team4@example.com", position: "Tester", color: "#FFC107" },
   
      
      
    ],
  },
  {
    id: "2",
    name: "TeamFlow",
    color: "blue",
    members: [
      { name: "팀플로우 팀원1", email: "flow1@example.com", position: "Frontend", color: "#6F42C1" },
      { name: "팀플로우 팀원2", email: "flow2@example.com", position: "Backend", color: "#E83E8C" }
    ],
  },
  {
    id: "3",
    name: "Ewootz",
    color: "green",
    members: [
      { name: "이웃즈 팀원1", email: "ewootz1@example.com", position: "Project Manager", color: "#20C997" },
      { name: "이웃즈 팀원2", email: "ewootz2@example.com", position: "QA Engineer", color: "#FD7E14" }
    ],
  },
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
  const dmItems = team.members.map((member) => member.name);

  return (
    <div style={{ display: 'flex' }}>
      <div
        className="blue-box"
        style={{ height: '100vh', width: '19vw', borderRadius: '0px', float: 'left' }}
      >
        <div className="hang" style={{ top:'-1vh' ,position: 'relative', height:'8vh', paddingRight: '3.5vw' }}>
          <div
            className="input-name" style={{ height: '5.5vh',
              width: '2.3vw',    borderRadius: '10px',   backgroundColor: team.color || 'transparent',
              marginRight: '1vw',  }}
          ></div><h1 style={{fontSize:'27px',paddingBottom:'0.5vh'}}>{team.name}</h1>
        </div>
        <div style={{ height: '1vh' }}></div>
        <div
          style={{ height: '78vh', display: 'flex', flexDirection: 'column',alignItems: 'center', }}
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
              <ul  className="custom-scrollbar" style={{     textAlign: 'center', listStyleType: 'none', 
             marginTop: '0.5vh', marginLeft: '0.5vw', maxHeight: '20vh', overflowY: 'auto',  padding: 0,}}>
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
              <ul  className="custom-scrollbar" style={{   textAlign: 'center',listStyleType: 'none', marginTop: '0.5vh', marginLeft: '0.5vw', maxHeight: '20vh', overflowY: 'auto', padding: 0,}}>
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
                paddingRight:'1.2vw',
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
        style={{ height: '100vh',  width: '81vw',  borderRadius: '0px',   backgroundColor: 'white',
        }}
      >
                   <div className="hang">
                   {activeSection === 'chatting' && (
      <div>
        <button
          style={{
            position: 'absolute',
            border: 'none',   background: 'none',
            right: '7vw',
            color: 'black',
            top: '3.3vh',
          }}
          onClick={() => handleSectionChange('call')}  // teamId 포함한 URL로 이동

        >
          <FiPhone size={26} />
        </button>
      </div>
    )}
                    <div>
                <button
                    style={{
                        position: 'absolute',
                        top: '2vh',
                        right: '3vw',
                        width: '3vw',  
                        height: '5.1vh', 
                        borderRadius: '50%',
                        border: 'none',
                        backgroundImage: `url(${userImage})`,
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
                    }}
                    onClick={() => setShowUserPopup(true)} 
                ></button></div>
            </div>
        {activeSection === 'chatting' && <Chatting teamId={team.id} />}
        {activeSection === 'teamcalendar' && <TeamCalendar teamId={team.id} userId={userId} />}
        {activeSection.startsWith('dm') && <DM selectedItem={activeSection.split('_')[1]} teamId={team.id} />}
        {activeSection.startsWith('meeting') && <Meeting selectedItem={activeSection.split('_')[1]} teamId={team.id} />}
        {activeSection === 'file' && <File teamId={team.id} />}
             {activeSection === 'member' && <Member members={team.members} />} {/* Member 컴포넌트 렌더링 */}
             {activeSection === 'call' && <Call teamId={teamId} />}

             {showUserPopup && (
                    <div className="popup-overlay" style={{ right: '2vw', justifyContent: 'flex-end', alignItems: 'flex-start',     }}>
                        <div className="popup-content" style={{
                            width: '22vw',   height: '50vh',  backgroundColor: '#D6E6F5',  borderRadius: '10px', 
                            marginTop: '11vh', marginRight: '3vw', display: 'flex',   flexDirection: 'column',alignItems: 'center',
                            justifyContent: 'space-between',  padding: '2vw',
                        }}>
                            <div className="hang" style={{ margin: '-1.2vh', justifyContent: 'flex-end', width: '100%' }}>
                                <button
                                    onClick={() => setShowUserPopup(false)} 
                                    className="close-button"  style={{ color: 'gray', fontSize: '15px'   }}  >   
                                       X 
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <img 
                                    src={userImage}   alt="User" 
                                    style={{ width: '6.5vw',  height: '12vh', borderRadius: '50%', backgroundColor:'white', marginBottom: '0.5vh'}} 
                                />
                           <p style={{ fontWeight: 'bold', margin: '0.5vh' ,fontSize:'22px'}}>{username}</p> 
                           <p style={{ margin: '2px 0' }}>{useremail}</p> <p style={{ margin: '2px 0' }}>{userjob}</p>   <p style={{ margin: '2px 0' }}>{usertime}</p>
                            </div>
                            <div>
                                <button  className='input-name' style={{width:'20vw',height:'5.5vh',borderRadius: '30px', fontSize:'18px',color:'black',  marginTop: '-5vh'}}> Manage your Account  </button>
                                <div>
                                    <div style={{height:'1.3vh'}}></div>
                                <button  className='input-name' style={{width:'20vw',height:'5.5vh',borderRadius: '30px', fontSize:'18px',color:'black'}}> Setting   
                                </button>
                            </div>
                            <div>
                                <button 
                                    style={{
                                        backgroundColor: 'transparent', color: 'black', paddingTop: '2vh',  borderRadius: '5px',   border: 'none',
                                    }}> sign out your account
                                        
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                )}
      </div>
    </div>
  );
};

export default Room;
