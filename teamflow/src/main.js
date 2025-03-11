import './App.css';
import { useEffect, useState } from 'react';
import Calendar from './calendar'; 
import { useNavigate } from 'react-router-dom';
import { HexColorPicker } from 'react-colorful'; // react-colorful 추가
import axios from 'axios';
import Swal from 'sweetalert2';  // sweetalert2로 오류 메시지 처리
import UserPopup from './UserPopup'; 


function Main() {
    let title = 'TeamFlow';
    const navigate = useNavigate();

    const [events, setEvents] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [showUserPopup, setShowUserPopup] = useState(false); 
    const [showTeamMakePopup, setTeamMakePopup] = useState(false); 
    const [selectedDate, setSelectedDate] = useState('');
    const [userImage, setUserImage] = useState(''); 
    const [username, setUsername] = useState('김수진');
    const [useremail, setUserEmail] = useState('user@naver.com');
    const [userjob, setUserjob] = useState('프론트엔드');
    const [usertime, setUserTime] = useState('10:00~18:00');
    const [userId, setUserId] = useState(1); // 🔹 현재 로그인한 사용자 ID
    const [userColor, setUserColor] = useState('#FFC0CB'); 
    const [selectedTeamIndex, setSelectedTeamIndex] = useState(null); // 선택된 팀 인덱스
    const [team_Name, setTeamName] = useState('');
    const [team_Color, setTeamColor] = useState('#D6E6F5'); 
    const [colorPickerVisible, setColorPickerVisible] = useState(false); 
    const [searchInput, setSearchInput] = useState(''); // 검색어 입력 상태
    const [filteredUsers, setFilteredUsers] = useState([]); // 검색된 사용자 리스트
    const [search_user, setSearchUser] = useState([]); // 최종 선택된 멤버 리스트
    const [isSearching, setIsSearching] = useState(false); // 검색 중인지 여부
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const day = today.getDate();

    const calculateDday = (dateString) => {
        const selectedDate = new Date(dateString);
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        const timeDifference = selectedDate - today;
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

        if (daysDifference < 0) {
            return `D+${Math.abs(daysDifference)}`; 
        } else if (daysDifference === 0) {
            return 'D-day';
        } else {
            return `D-${daysDifference}`; // 남은 날짜
        }
    };
    // 가짜 사용자 리스트 (임시 데이터)
const mockUsers = [
    { id: 'user1', name: '김철수' },
    { id: 'user2', name: '박영희' },
    { id: 'user3', name: '이민호' },
    { id: 'user4', name: '정다은' },
    { id: 'user5', name: '최수진' },    { id: 'user1', name: '김철수' },
    { id: 'user2s', name: '박영희' },
    { id: 'users3', name: '이민호' },
    { id: 'users4', name: '정다은' },
    { id: 'users5', name: '최수진' },
];


    const user = {
        name: username,
        email: useremail,
        job: userjob,
        time: usertime,
        image: userImage || '',
    };

    const [teams, setTeams] = useState([
        { id: '1', name: '수진이짱', color: 'red' },
        { id: '2', name: 'TeamFlow', color: 'blue' },
        { id: '3', name: 'Ewootz', color: 'green' },
    ]);

    const [userEvents, setUserEvents] = useState({
        1: {
            '2024-11-03': [{ event: '1:1 미팅', teamname: '개인 일정' }],
            '2024-11-10': [{ event: '프로젝트 리뷰', teamname: '개인 일정' }],
        },
    });

    // 🔹 팀 일정
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
// 🔹 검색어 입력 핸들링
const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
    setIsSearching(true); // 🔥 검색 중이므로 선택된 멤버 리스트 숨김

    if (event.target.value.trim()) {
        setFilteredUsers(mockUsers.filter(user => 
            user.id.includes(event.target.value.trim()) && !search_user.includes(user.id)
        ));
    } else {
        setFilteredUsers([]); // 검색어 없으면 리스트 숨김
        setIsSearching(false); // 🔥 검색창이 비어있으면 검색 종료
    }
};

const selectUser = (userId) => {
    setFilteredUsers([]);  // 🔥 검색 결과 리스트 즉시 삭제
    setSearchInput('');    // 🔥 입력창 초기화
    setIsSearching(false); // 🔥 검색 상태 해제

    if (!search_user.includes(userId)) {
        setSearchUser([...search_user, userId]); // 선택한 멤버 추가
    }
};


    useEffect(() => {
        let mergedEvents = {};

        // 🔹 팀 일정 추가
        Object.keys(teamEvents).forEach((teamId) => {
            Object.keys(teamEvents[teamId]).forEach((date) => {
                mergedEvents[date] = [
                    ...(mergedEvents[date] || []),
                    ...teamEvents[teamId][date],
                ];
            });
        });

        // 🔹 개인 일정 추가 (로그인한 사용자 ID 기준)
        if (userEvents && userEvents[userId]) {
            Object.keys(userEvents[userId]).forEach((date) => {
                mergedEvents[date] = [
                    ...(mergedEvents[date] || []),
                    ...userEvents[userId][date],
                ];
            });
        }

        setEvents(mergedEvents);
    }, [teamEvents, userEvents, userId]);

    const openPopup = (date) => {
        setSelectedDate(date);
        setShowPopup(true);
    };

    const handleMonthChange = (direction) => {
        let newMonth = month + direction;
        let newYear = year;

        if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        }
        setMonth(newMonth);
        setYear(newYear);
    };


    const handleEnterKey2 = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            specificFunction2(); // 엔터를 눌렀을 때 실행할 함수
        }
    };
    const specificFunction2 = () => {
        getSearch();
    };

    async function getSearch() {
        axios.get('/api/search/?', {
            params: { teamMembers: search_user },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response.status);
                if (response.status === 200) {
                    const extractedUsernames = response.data?.map(user => user.username);
                    setSearchUser(extractedUsernames);
                    console.log('유저 검색 결과:', search_user);
                }
            })
            .catch((error) => {
                console.error('서치 목록 가져오기 실패:', error);
            });
    };

    useEffect(() => {
        let mergedEvents = {};
        Object.keys(teamEvents).forEach((teamId) => {
            Object.keys(teamEvents[teamId]).forEach((date) => {
                mergedEvents[date] = [
                    ...(mergedEvents[date] || []),
                    ...teamEvents[teamId][date], 
                ];
            });
        });
    
        // 🔹 개인 일정 추가
        if (userEvents[userId]) {
            Object.keys(userEvents[userId]).forEach((date) => {
                mergedEvents[date] = [
                    ...(mergedEvents[date] || []),
                    ...userEvents[userId][date], // 개인 일정 추가
                ];
            });
        }
    
        setEvents(mergedEvents); 
    }, [teamEvents, userEvents, userId]);
    
  const handleTeamClick = (teamId) => {
    navigate(`/room/${teamId}`); // 클릭한 팀의 ID로 이동
  };

    const saveTeamname = event => {
        setTeamName(event.target.value);
        console.log(event.target.value);
      };
    
      const saveTeamMember = event => {
        setSearchUser(event.target.value);
        console.log(event.target.value);
      };


      const addTeam = () => {
        if (team_Name && team_Color && search_user.length >= 1) {
            const newTeam = {
                id: String(teams.length + 1),
                name: team_Name,
                color: team_Color,
            };
            setTeams([...teams, newTeam]);
    
            setTeamName('');
            setTeamColor('#D6E6F5');
            setSearchUser([]);
            setSelectedTeamIndex(null);
            setTeamMakePopup(false);
        } else {
            Swal.fire({
                icon: 'warning',
                text: '팀 이름 공백이면 안되고 팀원이 1명이상인지 확인하소',
            });
        }
    };
    return (
        <div className="white-line">
            <div className="hang">
                <p  style={{ color: 'black', fontSize: 53, marginTop: '1.6vh', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.4)',}}     >
                    {title} </p>
                <button
                    style={{
                        position: 'absolute',
                        top: '7vh',
                        right: '5vw',
                        width: '3.5vw',  
                        height: '6vh', 
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
                ></button>
            </div>

            <div className="hang">
                <Calendar  events={events}  year={year}   month={month}    day={day} openPopup={openPopup}    onMonthChange={handleMonthChange} teams={teams} userColor={userColor}   />
                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content" style={{ width: '22vw', height: '50vh' }}>
                            <div className="hang" style={{ margin: '-1.2vh', justifyContent: 'space-between' }}>
                                <p style={{ fontSize: '18px', fontWeight: '700', paddingLeft: '1vw' }}>
                                    {`${new Date(selectedDate).getMonth() + 1}월 ${new Date(selectedDate).getDate()}일`}
                                </p>
                                <button
                                    onClick={() => setShowPopup(false)}  className="close-button"   style={{ color: 'gray' }}
                                             >     X  </button>
                            </div>
                            <div style={{ textAlign: 'left',paddingBottom:'1.7vh',paddingLeft:'1.5vw',fontSize:'17px'}}>{calculateDday(selectedDate)}</div>
                            <div
                                style={{ maxHeight: '40vh', overflowY: 'auto', paddingRight: '1vw', display: 'flex', flexDirection: 'column', gap: '0.9vh',marginLeft: '1vw',
                                }}
                                className="custom-scrollbar"   >
                       {events[selectedDate] &&
                                events[selectedDate].map((event, index) => {
                                    // 🔹 일정 색상 설정 (팀 일정은 팀 색상, 개인 일정은 개인 색상)
                                    const team = teams.find((t) => t.name === event.teamname);
                                    const eventColor =
                                        event.teamname === '개인 일정' ? userColor : team?.color || '#D6E6F5';

                                        return (
                                            <div
                                                key={index}
                                                style={{  marginLeft: '1vw', display: 'flex', justifyContent: 'center',  alignItems: 'center', width: '18vw',height: '3vh',
                                                    padding: '13px', borderRadius: '10px',                                                  backgroundColor: eventColor,

                                                    fontSize: '14px',  textAlign: 'center', margin: '5px auto',
                                                }}
                                            >
                                                <div>{event.event}</div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                )}
           <button
                    style={{ position: 'absolute',top: '7vh',right: '5vw',
                        width: '3.5vw', height: '6vh',borderRadius: '50%',border: 'none',  backgroundImage: `url(${user.image})`, backgroundSize: 'cover',
                        backgroundPosition: 'center',display: 'flex',justifyContent: 'center',alignItems: 'center',
                        cursor: 'pointer', boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
                    }}
                    onClick={() => setShowUserPopup(true)}
                ></button>
                <UserPopup isOpen={showUserPopup} onClose={() => setShowUserPopup(false)} user={user} />
                {showTeamMakePopup && (
                <div className="popup-overlay">
                    <div className="popup-content" style={{ width: '33vw', height: '65vh', backgroundColor: '#D6E6F5' }}>
                        <div className="hang" style={{ justifyContent: 'flex-end', width: '100%' }}>
                            <button
                                onClick={() => setTeamMakePopup(false)}
                                className="close-button"
                                style={{ color: 'gray', fontSize: '18px' }}
                            >
                                X
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '0.7vh' }}>

                            <div className="input-name" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30vw', height: '5.8vh', borderRadius: '27px', margin: '0.3vw' }}>
                                <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ color: 'black' }}>
                                        Team name :
                                    </div>
                                    <div style={{ width: '0.4vw' }}></div>
                                    <input className='input-name' type='text' placeholder='생성할 팀명을 입력해주세요' value={team_Name} onChange={saveTeamname}style={{ textAlign: 'left', display: 'flex', alignItems: 'center', width: '20vw', height: '5.5vh', fontSize: '13px' }}  />

                                </div>
                            </div>
                            <div className="input-name" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30vw', height: '5.8vh', borderRadius: '27px', margin: '0.3vw' }}>
                                <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ color: 'black' }}>
                                        Team color :
                                    </div>
                                    <div style={{ width: '0.4vw' }}></div>
                                    <div className="input-name"  style={{ textAlign: 'left', display: 'flex', alignItems: 'center', width: '18.5vw', height: '5.8vh', fontSize: '13px' }}>
                                    {team_Color || '좌측 아이콘을 눌러 팀 색을 선택해주세요'}                                    </div>
                                    <div>
                                        <button
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '2.6vw',
                                                height: '5vh',
                                                borderRadius: '100px',
                                                backgroundColor: team_Color, 
                                                border: 'none',
                                            }}
                                            onClick={() => setColorPickerVisible(!colorPickerVisible)} 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="input-name" style={{  display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30vw', 
                                 height: '5.8vh', borderRadius: '27px', margin: '0.3vw' }}>
                                    <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center' }}>
                                        <div style={{ color: 'black' }}>  Team member : </div>
                                        <div style={{ width: '0.4vw' }}></div>
                                         <input  className='input-name' type='text'placeholder='ID를 입력하여 검색하세요'value={searchInput}onChange={handleSearchInput}
                                         style={{ textAlign: 'left', display: 'flex', alignItems: 'center', width: '19vw', height: '5.5vh', fontSize: '13px' }}  />
                                         </div>
                                         </div>
                                         <div className="input-name" style={{ display: 'flex', flexDirection: 'column',  alignItems: 'center', backgroundColor: 'white', 
                                         width: '30vw', height: '33vh',  borderRadius: '27px', marginTop: '1vh', border: '1px solid #ddd',padding: '10px'}}>
                                            {isSearching && filteredUsers.length > 0 ? (
                                                <div style={{ width: '98%',  maxHeight: '30vh',  overflowY: 'auto',  padding: '10px' }}>
                                                      {filteredUsers.map(user => (
                                                         <div 
                                                          key={user.id}
                                                          style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }} >
                                                            <span>{user.name} ({user.id})</span>
                                                             <button style={{ background: 'lightblue', border: 'none', padding: '3px 7px', borderRadius: '5px', cursor: 'pointer' }}
                                                             onClick={() => selectUser(user.id)} >
                                                                  추가
                                                                   </button>
                                                                    </div>))} </div>
                                                                ) : null}
                                                                {!isSearching && search_user.length > 0 && (
                                                                    <div style={{  width: '100%', height: '100%',   overflowY: 'auto',padding: '10px'}}>
                                                                        {search_user.map((userId, index) => (
                                                                            <div key={index} style={{ backgroundColor: '#D6E6F5', padding: '7px 15px', borderRadius: '15px', margin: '5px', display: 'inline-block' }}>
                                                                                {userId}
                                                                                 </div> ))}
                                                                                 </div>)}
                                                                                 </div>
                                                                                 </div>
                                                                                  {colorPickerVisible && (
                                                                                     <div style={{ position: 'absolute', top:'18vh',right:'15vw',zIndex: 10 }}>
                                                                                         <HexColorPicker color={team_Color} onChange={setTeamColor} />
                                                                                          </div>
                                                                                         )}
                                                                                         <div style={{ textAlign: 'right',paddingRight: '1vw',paddingTop:'1,5vh' }}>
                                                                                            <button  className="input-name" style={{ color: 'black', width: '7vw', height: '4.5vh' }}
                                                                                             onClick={addTeam} >
                                                                                                confirm </button>
                                                                                                  </div> </div> </div> )}
                                                                                                  <div style={{ width: '3.5vw' }}></div>
                                                                                                   <div className="blue-box" style={{ width: '30vw', height: '60vh', backgroundColor: 'white' }}>
                                                                                                     <div className="hang" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                                                        {Array(2)
                                                                                                        .fill(null)
                                                                                                        .map((_, index) => {
                                                                                                            const team = teams[index];
                                                                                                             return (
                                                                                                                 <div  key={index}   
                                                                                                                 onClick={() => {
                                                                                                                      if (team) {
                                                                                                                         console.log("Navigating to: ", team.id);  
                                                                                                                         setSelectedTeamIndex(index); 
                                                                                                                         handleTeamClick(team.id); 
                                                                                                                         } else {
                                                                                                                            setTeamMakePopup(true); 
                                                                                                                            setSelectedTeamIndex(index);   }
                                                                                                                         }}
                                                                                                                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 1.3vw' }}
                                                                                                                          >
                                                                                                                            <button
                                                                                                                            className="square-button"
                                                                                                                            style={{backgroundColor: team?.color || '#D9D9D9', 
                                                                                                                                 margin: '5px',fontSize: team ? '16px' : '40px',position: 'relative',width: '7.5vw', height: '13vh',
                                                                                                                                 display: 'flex',justifyContent: 'center',alignItems: 'center',    }} >
                                                                                                                                     {team?.name ? '' : '+'} 
                                                                                                                                       </button>

                    {team && (
                        <p
                            style={{
                                paddingTop: '0.5vh',
                                fontSize: '15px',
                            }}
                        >
                            {team.name}
                        </p>
                    )}
                </div>
            );
        })}
</div>
    <div style={{height:'6vh'}}></div>
    <div className="hang" style={{ display: 'flex', justifyContent: 'space-between' }}>
    {Array(2)
    .fill(null)
    .map((_, index) => {
      const team = teams[index + 2] || {};  
      return (
        <div
          key={index + 2}
          onClick={() => {
            if (team && team.id) {
              console.log("Navigating to: ", team.id);  
              setSelectedTeamIndex(index + 2); 
              handleTeamClick(team.id); 
            } else {
              setTeamMakePopup(true);
              setSelectedTeamIndex(index + 2); // 선택한 팀 인덱스 설정
            }
          }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 1.3vw' }}
        >
          <button
            className="square-button"
            style={{
              backgroundColor: team.color || '#D9D9D9', // 팀이 없으면 기본 회색
              margin: '5px',
              fontSize: team.name ? '16px' : '40px', // 팀이 있으면 글자 작게, 없으면 크게
              position: 'relative',
              width: '7.5vw',
              height: '13vh',
            }}
          >
            {team.name ? '' : '+'} {/* 팀 이름이 있으면 빈 문자열, 없으면 '+' 표시 */}
          </button>

          {team.name && (
            <p
              style={{
                marginTop: '0.5vh',
                fontSize: '15px',
              }}
            >
              {team.name}
            </p>
          )}
        </div>
      );
    })}
</div>
</div>
                <div style={{ height: '5vh' }}></div>
            </div>
        </div>
    );
}

export default Main;
