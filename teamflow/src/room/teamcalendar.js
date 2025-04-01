import React, { useState } from 'react';
import Calendar from '../calendar';
import { useEffect } from 'react';
import axios from 'axios';

const TeamCalendarWrapper = ({ teamId, userId, teams, userColor }) => {
  const [viewType, setViewType] = useState('team'); 
    const [showPopup, setShowPopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newEvent, setNewEvent] = useState('');
    const [teamColors, setTeamColors] = useState({});

    const [teamEvents, setTeamEvents] = useState({});
    const [userEvents, setUserEvents] = useState({    });

    const events = viewType === 'team' ? teamEvents[teamId] || {} : userEvents[userId] || {};

    // 날짜 정보
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [day] = useState(today.getDate());
    const [myColor, setMyColor] = useState(null); // 기본 색상

    useEffect(() => {
      const token = localStorage.getItem('access_token');
      axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        console.log('🎨 프로필 정보:', res.data);
        setMyColor(res.data.myColor || '#D6E6F5'); 
      })
      .catch(err => console.error('❌ 프로필 정보 불러오기 실패:', err));
    }, []);
    
    // 팝업 열기
    const openPopup = (date) => {
        setSelectedDate(date);
        setShowPopup(true);
    };

    // 월 변경 핸들러
    const handleMonthChange = (change) => {
        let newMonth = month + change;
        let newYear = year;

        if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        } else if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        }

        setYear(newYear);
        setMonth(newMonth);
    };

    // 디데이 계산
    const calculateDday = (date) => {
        const targetDate = new Date(date);
        const today = new Date();
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays === 0 ? "오늘" : diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
    };

    // 할 일 추가 UI 오픈
    const openAddPopup = () => {
        setShowAddPopup(true);
    };
    const addEvent = () => {
        if (newEvent.trim() === '') return;
    
        const updatedEvents = { ...events };
        const matchedTeam = teams.find(team => Number(team.teamId) === Number(teamId));
        const teamColor = matchedTeam?.teamColor || '#D6E6F5';
        const teamName = matchedTeam?.teamName || '팀 일정';
    
        updatedEvents[selectedDate] = [
          ...(updatedEvents[selectedDate] || []),
          { event: newEvent, teamname: viewType === 'team' ? teamName : '개인 일정',     color: viewType === 'team' ? teamColor : myColor  // ✅ 여기 수정
          }
        ];
    
        if (viewType === 'team') {
          setTeamEvents((prev) => ({ ...prev, [teamId]: updatedEvents }));
        } else {
          setUserEvents((prev) => ({ ...prev, [userId]: updatedEvents }));
        }
    
        const token = localStorage.getItem('access_token');
        const colorToUse = viewType === 'team' ? teamColor : myColor;
    
        const postData = {
          title: newEvent,
          startTime: selectedDate,
          endTime: selectedDate,
          color: myColor || '#D6E6F5',
        };
    
        const endpoint = viewType === 'team' ? '/api/events/team' : '/api/events/personal';
        const dataToSend = viewType === 'team' ? { ...postData, teamId: parseInt(teamId) } : postData;
    
        axios.post(endpoint, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => console.log(`✅ 일정 추가 성공 (${viewType})`))
        .catch(err => console.error(`❌ 일정 추가 실패 (${viewType}):`, err));
    
        setNewEvent('');
        setShowAddPopup(false);
      };
      useEffect(() => {
        const colors = {};
        teams.forEach(team => {
          colors[team.teamId] = team.teamColor || '#D6E6F5';
        });
        setTeamColors(colors);
      }, [teams]);
      
      useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!teamId) return;
      
        axios.get(`/api/events/team/${teamId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const fetchedEvents = {};
          res.data.forEach(event => {
            const start = new Date(event.startTime);
            const end = new Date(event.endTime);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
              const dateStr = d.toISOString().split('T')[0];
              if (!fetchedEvents[dateStr]) fetchedEvents[dateStr] = [];
              fetchedEvents[dateStr].push({
                event: event.title,
                teamname: teams.find(t => t.teamId === event.teamId)?.teamName || '팀 일정',
                color: teamColors[event.teamId] || '#D6E6F5',
              });
            }
          });
          setTeamEvents(prev => ({ ...prev, [teamId]: fetchedEvents }));
          console.log("✅ 팀 일정 불러오기 성공");
        })
        .catch((err) => console.error('❌ 팀 일정 가져오기 실패:', err));
      }, [teamId, teamColors]);

      
      useEffect(() => {
  if (!myColor) return;  // 🎯 myColor가 로딩되지 않았으면 실행 안 함

  const token = localStorage.getItem("access_token");
  axios.get(`/api/events/personal`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((res) => {
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
          color: event.color || myColor || '#D9D9D9',
        });
      }        
    });
    setUserEvents(prev => ({ ...prev, [userId]: personalEventMap }));
    console.log("✅ 개인인 일정 불러오기 성공");

  })
  .catch((err) => console.error("❌ 개인 일정 가져오기 실패:", err));
}, [ myColor]);

  
    return (
      <div style={{ textAlign: 'center',position:'relative' }}>
      <div style={{display: "flex",  justifyContent: "center", width: "30vw",
      height: "5vh",position: "absolute",left: "50%",transform: "translateX(-50%)",backgroundColor: "#ddd", borderRadius: "30px",padding: "0.4vw",alignItems: "center",overflow:"hidden", boxShadow: "2px 2px 5px rgba(0,0,0,0.2)"}}>
          <div className="toggle-slider" style={{ transform: `translateX(${viewType === 'team' ? '0%' : '100%'})` }} />
          <button className={`toggle-button ${viewType === 'team' ? 'active' : ''}`} onClick={() => setViewType('team')}>
              TEAM
          </button>
          <button className={`toggle-button ${viewType === 'my' ? 'active' : ''}`} onClick={() => setViewType('my')}>
              MY
          </button>
      </div>
      <div style={{ marginTop: "14vh" }}>
          <Calendar
              events={events}
              year={year}
              month={month}
              day={day}
              onMonthChange={handleMonthChange}
              openPopup={openPopup}
              teams={teams}
              userColor={myColor}
          />
      </div>

            {/* 일정 팝업 */}
            {showPopup && (
    <div className="popup-overlay">
        <div className="popup-content" style={{ width: '22vw', height: '50vh' }}>
            <div className="hang" style={{ justifyContent: 'space-between' }}>
                <p style={{ fontSize: '18px', fontWeight: '700', paddingLeft: '1vw' }}>
                    {`${new Date(selectedDate).getMonth() + 1}월 ${new Date(selectedDate).getDate()}일`}
                </p>
                <button onClick={() => setShowPopup(false)} className="close-button" style={{ color: 'gray' }}>X</button>
            </div>

            {/* 디데이 표시 */}
            <div style={{ textAlign: 'left', paddingBottom: '1.5vh', paddingLeft: '1.5vw', fontSize: '17px' }}>
                {calculateDday(selectedDate)}
            </div>

            {/* 일정 리스트 (팀 색상 적용) */}
            <div className="custom-scrollbar" 
                style={{
                    textAlign: 'left',
                    height: "31.5vh",
                    maxHeight: '31vh',
                    overflowY: 'auto',
                    paddingRight: '1vw',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.9vh',
                    marginLeft: '1vw'
                }}>
                
                {events[selectedDate] && events[selectedDate].length > 0 ? (
                    events[selectedDate].map((event, index) => {
                      let eventColor;

                      if (viewType === 'team') {
                          // 팀 일정일 경우, 팀 색상 가져오기
                          eventColor =
                          event.color || teams.find(team => team.name === event.teamname)?.color || '#D6E6F5';
                                                } else {
                          // 개인 일정일 경우, 사용자 색상 적용
                          eventColor = event.color || myColor || '#D6E6F5';  // ✅ 여기!!
                        }
                        return (
                            <div 
                                key={index} 
                                className="event-item"
                                style={{
                                    padding: '10px',
                                    backgroundColor: eventColor,  // 팀별 색상 적용
                                    borderRadius: '10px',
                                    color: 'black'
                                }}
                            >
                                {event.event}
                            </div>
                        );
                    })
                ) : (
                    <p>일정이 없습니다.</p>
                )}
            </div>

            <button onClick={openAddPopup} 
                className="input-name" 
                style={{
                    textAlign: 'left',
                    marginTop: '10px',
                    width: "20vw",
                    height: "5vh",
                    background: "#D9D9D9",
                    fontSize: "13px"
                }}>
                일정 추가 +
            </button>
        </div>
    </div>
)}


            {/* 할 일 추가 팝업 */}
            {showAddPopup && (
    <div className="popup-overlay">
        <div className="popup-content" style={{ width: '22vw', height: '50vh' }}>
            <div className="hang" style={{ justifyContent: 'space-between' }}>
                <p style={{ fontSize: '18px', fontWeight: '700', paddingLeft: '1vw' }}>
                    {`${new Date(selectedDate).getMonth() + 1}월 ${new Date(selectedDate).getDate()}일`}
                </p>
                <button onClick={() => setShowAddPopup(false)} className="close-button" style={{ color: 'gray' }}>X</button>
            </div>

            {/* 입력 필드 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1vh' }}>
                <textarea
                    className='input-name'
                    style={{
                        backgroundColor: "#D9D9D9",
                        width: "20.5vw",
                        height: "35vh",
                        marginBottom: "1vh",
                        padding: "1vh", 
                        fontSize: "14px",
                        resize: "none",  // 크기 조정 방지
                        border: "none",
                        borderRadius: "5px",
                    }}
                    value={newEvent}
                    onChange={(e) => setNewEvent(e.target.value)}
                    placeholder="할 일을 입력하세요"
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '1vw' }}>
                <button
                    onClick={addEvent}
                    className='input-name'
                    style={{
                        width: "5vw",
                        height: "5vh",
                        fontSize: "13px",
                        color: "black",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    추가하기
                </button>
            </div>
        </div>
    </div>
)}

        </div>
    );
};

export default TeamCalendarWrapper;
