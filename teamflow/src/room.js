import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Chatting from './room/chatting';
import TeamCalendar from './room/teamcalendar';
import Meeting from './room/meeting';
import DM from './room/dm';
import File from './room/file';
import Call from './room/call';
import Member from './room/member';
import UserPopup from './UserPopup'; 
import DMMain from './DMMain'; 
import MeetingMain from './MeetingMain'; 
import { useEffect } from 'react';
import axios from 'axios';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import { FiPhone } from 'react-icons/fi'; 

const Room = () => {
  const { teamId } = useParams(); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [meetingRecords, setMeetingRecords] = useState([]); 
  const [activeSection, setActiveSection] = useState('chatting');
  const [dropdowns, setDropdowns] = useState({
    dm: false,
    meeting: false,
  });
  const [showUserPopup, setShowUserPopup] = useState(false); 
  const [userImage, setUserImage] = useState(''); 
  const [activeDropdownItem, setActiveDropdownItem] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    job: "",
    time: "",
    image: "", // 프로필 URL
  });
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    axios.get('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        const data = res.data;
        setUser({
          name: data.username ?? "사용자",
          email: data.email ?? "이메일 없음",
          job: data.position ?? "직책 없음",
          time: data.contactTime ?? "근무시간 없음",
          image: data.profile ?? "",
          color: data.myColor ?? "#D6E6F5", // ← 추가!
        });
        
      })
      .catch((err) => {
        console.error("❌ 사용자 정보 조회 실패:", err);
      });
  }, []);
  
const userId = "1";
const [teamEvents, setTeamEvents] = useState({});
const [userEvents, setUserEvents] = useState({});
const [events, setEvents] = useState({}); // 🔹 병합된 캘린더 이벤트 상태

// 🔹 일정 병합
useEffect(() => {
  const merged = {};

  // 팀 일정
  if (teamEvents[teamId]) {
    Object.entries(teamEvents[teamId]).forEach(([date, events]) => {
      merged[date] = [...(merged[date] || []), ...events];
    });
  }

  // 개인 일정
  if (userEvents[userId]) {
    Object.entries(userEvents[userId]).forEach(([date, events]) => {
      merged[date] = [...(merged[date] || []), ...events];
    });
  }

  setEvents(merged);
}, [teamEvents, userEvents, userId, teamId]);

const userColor = user.color || "#D6E6F5";
const [teamData, setTeamData] = useState(null);
console.log("🔥 teamId:", teamId); // ← 이거 추가해봐
// 🔹 팀 일정 받아오는 useEffect
useEffect(() => {
  if (!teamId || !teamData) return;

  const token = localStorage.getItem("access_token");

  axios.get(`/api/events/team/${teamId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      const newEvents = {};
      console.log("✅ 팀 일정 성공:", res.data);

      res.data.forEach(event => {
        const start = new Date(event.startTime);
        const end = new Date(event.endTime);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
          if (!newEvents[dateStr]) newEvents[dateStr] = [];

          newEvents[dateStr].push({
            event: event.title,
            teamname: teamData.teamName, // ✅ 이 시점에 teamData는 null 아님
            color: event.color,
          });
        }
      });

      setTeamEvents(prev => ({
        ...prev,
        [teamId]: newEvents
      }));
    })
    .catch((err) => {
      console.error("❌ 팀 일정 가져오기 실패:", err);
    });
}, [teamId, teamData]);

useEffect(() => {
  const token = localStorage.getItem("access_token");

  axios.get(`/api/events/personal`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      console.log("✅ 개인 일정 가져오기 성공:", res.data);
      const personalEventMap = {};

      res.data.forEach(event => {
        const start = new Date(event.startTime);
        const end = new Date(event.endTime);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          if (!personalEventMap[dateStr]) personalEventMap[dateStr] = [];

          personalEventMap[dateStr].push({
            event: event.title,
            teamname: "개인 일정",
            color: userColor, // 유저 색상 적용
          });
        }
      });

      setUserEvents(prev => ({
        ...prev,
        [userId]: personalEventMap
      }));
    })
    .catch((err) => {
      console.error("❌ 개인 일정 가져오기 실패:", err);
    });
}, [userId]);



useEffect(() => {
  if (!teamId) return;
  const token = localStorage.getItem("access_token");

  // 🔹 팀 정보 불러오기
  axios.get(`/api/teams/${teamId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      console.log("✅ 팀 정보 조회 성공:", res.data);
      setTeamData(res.data);
    })
    .catch((err) => {
      console.error("❌ 팀 정보 조회 실패:", err);
    });

  // 🔹 회의록 불러오기
  axios.get(`/api/meeting-logs/${teamId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      console.log("✅ 회의록 불러오기 성공:", res.data);
      const mappedRecords = res.data.map(log => ({
        title: log.title,
        content: log.logText,
        date: log.meetingDate,
        logId: log.logId,          // ✅ 이거 추가

      }));
      setMeetingRecords(mappedRecords);
    })
    .catch((err) => {
      console.error("❌ 회의록 불러오기 실패:", err);
    });

}, [teamId]);



  if (!teamData) return <div>로딩 중...</div>;


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

  const handleDMClick = () => {
    setActiveSection('dmMain'); 
    toggleDropdown('dm');
  };
  
  const handleDropdownItemClick = (section, item) => {
    if (section === 'dm') {
      setActiveSection('dm'); 
      setSelectedItem(item); 
      setActiveDropdownItem(item.username || item.name); 
    } else {
      setActiveSection(section);
    }
  };

  const handleMeetingClick = () => {
    setDropdowns((prev) => ({
      ...prev,
      meeting: !prev.meeting, 
    }));
    setActiveSection('meetingMain');
  };
  
  const handleNewMeeting = () => {
    setSelectedItem({ title: '', content: '', isNew: true }); // ✅ isNew 추가
    setActiveSection('meeting');
  };
  
const handleMeetingSelect = (logId) => {
  const record = meetingRecords.find((r) => r.logId === logId);
  if (record) {
    setSelectedItem(null); // 트리거를 보장하기 위해 잠시 null 처리
    setTimeout(() => {
      setSelectedItem({ ...record, isNew: false });
      setActiveSection('meeting');
      setActiveDropdownItem(record.title); // ✅ 드롭다운에서 선택 표시용
    }, 0);
  }
};

const dmItems = teamData?.members?.map((member) => member.username) || [];
  
  const handleSaveMeeting = (title, content) => {
    if (!title.trim()) return;
    const newRecord = { title, content };
  
    setMeetingRecords((prev) => {
      const existingIndex = prev.findIndex((r) => r.title === title);
      if (existingIndex !== -1) {
        const updatedRecords = [...prev];
        updatedRecords[existingIndex] = newRecord;
        return updatedRecords;
      }
      return [...prev, newRecord]; 
    });
  
    setActiveSection('meetingMain');
  };
  
  return (
    <div style={{ display: 'flex' }}>
      <div
        className="blue-box"
        style={{ height: '100vh', width: '19vw', borderRadius: '0px', float: 'left' }}
      >
        <div className="hang" style={{ top:'-1vh' ,position: 'relative', height:'8vh', paddingRight: '3.5vw' }}>
          <div
            className="input-name" style={{ height: '5.5vh',
              width: '2.3vw',    borderRadius: '10px',   backgroundColor: teamData.teamColor|| 'transparent',
              marginRight: '1vw',  }}
          ></div><h1 style={{fontSize:'27px',paddingBottom:'0.5vh'}}>{teamData.teamName}</h1>
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
            <button className="input-name"
              style={{ width: '10vw', height: '5vh', borderRadius: '0px', marginBottom: '1vh',  backgroundColor: '#D6E6F5', color: activeSection.startsWith('meeting') ? 'black' : 'gray',  borderBottom: dropdowns.meeting ? '0.5px solid gray' : 'none', 
    display: 'flex',   justifyContent: 'space-between',    alignItems: 'center',  }} onClick={handleMeetingClick} >
       <div style={{ paddingLeft: '2vw', fontSize: '17px' }}>Meeting</div>
        <div style={{ marginLeft: '2vw', marginTop: '4px' }}>  {dropdowns.meeting ? <MdArrowDropDown /> : <MdArrowDropUp />}  </div></button>
        {dropdowns.meeting && (
     <ul  className="custom-scrollbar" style={{   textAlign: 'center',listStyleType: 'none', marginTop: '0.5vh', marginLeft: '0.5vw', maxHeight: '20vh', overflowY: 'auto', padding: 0,}}>
{meetingRecords.map((record) => (
  <li
  key={record.logId}
  onClick={() => handleMeetingSelect(record.logId)}  // ✅ logId로 넘김
    style={{
      color: activeDropdownItem === record.title ? 'black' : 'gray',
      fontWeight: activeDropdownItem === record.title ? 'bold' : 'normal',
    }}
  >      
    {record.title.length > 6 ? `${record.title.slice(0, 6)}...` : record.title}
  </li>
))}


</ul>
    )}
    </div>      <div>
         <button className="input-name" 
         style={{ width: '10vw',height: '5vh', borderRadius: '0px', marginBottom: '1vh', backgroundColor: '#D6E6F5',
          color: activeSection.startsWith('dm') ? 'black' : 'gray', borderBottom: dropdowns.dm ? '0.5px solid gray' : 'none', display: 'flex', 
          justifyContent: 'space-between',  alignItems: 'center', }}
          onClick={handleDMClick} >
            <div style={{ paddingLeft: '3vw', fontSize: '17px' }}>DM</div>  
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
              borderRadius:'70px', padding:0,width: '2.7vw',   height: '5vh',
              backgroundColor: activeSection === 'member' ? '#8A8A8A' : '#D9D9D9',display: 'flex', justifyContent: 'center',
              alignItems: 'center',transition: 'background-color 0.3s ease', left:'-5vw',
              color: activeSection === 'member' ? 'white' : 'white',
            }}
            onClick={() => handleSectionChange('member')}
          >
           <div style={{color:'black'}}>M</div> 
          </button>
        </div>
      </div>
      <div  className="blue-box" style={{ height: '100vh',  width: '81vw',  borderRadius: '0px',   backgroundColor: 'white',  }} >
         <div className="hang">
                {activeSection === 'chatting' && (
                  <div>
                    <button style={{position: 'absolute', border: 'none',   background: 'none', right: '7vw',color: 'black', top: '3.3vh', }}
          onClick={() => handleSectionChange('call')} >
          <FiPhone size={26} />
             </button>
             </div>
            )}     
              <div>
                <button
                    style={{ position: 'absolute',top: '2vh',
                        right: '3vw',width: '3vw',   height: '5.1vh', borderRadius: '50%', border: 'none', backgroundImage: `url(${user.image})`,backgroundSize: 'cover', 
                        backgroundPosition: 'center',display: 'flex',justifyContent: 'center',  alignItems: 'center',
                        cursor: 'pointer',boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
                    }}
                    onClick={() => setShowUserPopup(true)} 
                ></button></div>
            </div>
            {activeSection === 'chatting' && <Chatting teamId={teamData.teamId} />}
            {activeSection === 'teamcalendar' && <TeamCalendar teamId={teamData.teamId} userId={userId} userColor={userColor}events={events}teams={[teamData]}     />}
            {activeSection === 'dmMain' && (<DMMain teamId={teamData.teamId} teamMembers={teamData?.members || []} onSelectDM={(member) => handleDropdownItemClick('dm', member.name)} />)}
              {activeSection === 'dm' && selectedItem && <DM selectedItem={selectedItem} teamId={teamData.teamId} />}
              {activeSection === 'meetingMain' && (<MeetingMain meetingRecords={meetingRecords} onSelectMeeting={handleMeetingSelect} onNewMeeting={handleNewMeeting}/>
            )}
{activeSection === 'meeting' && selectedItem && (
  <Meeting selectedItem={selectedItem} teamId={teamData.teamId} onSave={handleSaveMeeting} />
)}
            {activeSection === 'file' && <File teamId={teamData.teamId} />}
            {activeSection === 'member' && <Member members={teamData.members}myUserId={user.userId} myColor={user.color} />} 
            {activeSection === 'call' && <Call teamId={teamId} />}
             <button style={{position: 'absolute', top: '2vh', right: '3vw', width: '3vw', height: '5.1vh',
            borderRadius: '50%', border: 'none', backgroundImage: `url(${user.image})`,backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer'}}
          onClick={() => setShowUserPopup(true)}
        ></button>
        <UserPopup isOpen={showUserPopup} onClose={() => setShowUserPopup(false)} user={user} />     </div>
    </div>
  );
};

export default Room;
