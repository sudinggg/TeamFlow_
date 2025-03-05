import React, { useState } from 'react';
import Calendar from '../calendar';

const TeamCalendarWrapper = ({ teamId, userId, teams, userColor }) => {
  const [viewType, setViewType] = useState('team'); 
    const [showPopup, setShowPopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newEvent, setNewEvent] = useState('');

    const [teamEvents, setTeamEvents] = useState({
        1: {
            '2024-11-01': [{ event: '팀 미팅', teamname: '수진이짱' }],
            '2024-11-15': [{ event: '팀 회식', teamname: '수진이짱' }],
        },
        2: {
            '2024-11-02': [{ event: '팀 프로젝트', teamname: 'TeamFlow' }],
            '2024-11-18': [{ event: '워크숍', teamname: 'TeamFlow' }],
        },
        3: {
            '2024-11-05': [{ event: 'PM 회의', teamname: 'Ewootz' }],
            '2024-11-20': [{ event: '테스트 진행', teamname: 'Ewootz' }],
        },
    });

    const [userEvents, setUserEvents] = useState({
        1: {
            '2024-11-03': [{ event: '1:1 미팅', teamname: '개인 일정' }],
            '2024-11-10': [{ event: '프로젝트 리뷰', teamname: '개인 일정' }],
        },
    });

    // 현재 선택된 viewType에 따라 이벤트 가져오기
    const events = viewType === 'team' ? teamEvents[teamId] || {} : userEvents[userId] || {};

    // 날짜 정보
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [day] = useState(today.getDate());

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

    // 할 일 추가 핸들러
    const addEvent = () => {
      if (newEvent.trim() === '') return;
  
      const updatedEvents = { ...events };
      const teamName = viewType === 'team' ? teams.find(team => team.id === teamId)?.name || '팀 일정' : '개인 일정';
  
      updatedEvents[selectedDate] = [...(updatedEvents[selectedDate] || []), { event: newEvent, teamname: teamName }];
  
      if (viewType === 'team') {
          setTeamEvents((prev) => ({
              ...prev,
              [teamId]: updatedEvents,
          }));
      } else {
          setUserEvents((prev) => ({
              ...prev,
              [userId]: updatedEvents,
          }));
      }
  
      setNewEvent('');
      setShowAddPopup(false);
  };
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
              userColor={userColor}
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
                          eventColor = teams.find(team => team.name === event.teamname)?.color || '#D6E6F5';
                        } else {
                          // 개인 일정일 경우, 사용자 색상 적용
                          eventColor = userColor;
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

            {/* 일정 추가 버튼 */}
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

            {/* 추가하기 버튼 (오른쪽 정렬) */}
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
