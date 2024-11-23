import './App.css';
import { useEffect, useState } from 'react';
import Calendar from './calendar'; // Calendar 컴포넌트 임포트
import { useNavigate } from 'react-router-dom';

function Main() {
    let title = 'TeamFlow';
    const navigate = useNavigate();

    const [events, setEvents] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [showUserPopup, setShowUserPopup] = useState(false); // 새로운 팝업 상태 추가
    const [selectedDate, setSelectedDate] = useState('');
    const [userImage, setUserImage] = useState(''); // 사용자 이미지를 관리하는 state
    const [username, setUsername] = useState('김수진');
    const [useremail, setUserEmail] = useState('user@naver.com');
    const [userjob, setUserjob] = useState('프론트엔드');

    const [usertime, setUserTime] = useState('10:00~18:00'); // 사용자 시간 정보

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
            return `D+${Math.abs(daysDifference)}`; // 날짜가 지난 경우
        } else if (daysDifference === 0) {
            return 'D-day';
        } else {
            return `D-${daysDifference}`; // 남은 날짜
        }
    };

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

    useEffect(() => {
        const exampleEvents = {
            '2024-11-01': [
                { teamname: 'TeamFlow', event: '회의 1' },
                { teamname: '수진이짱', event: '프로젝트 발표' }
            ],
            '2024-11-02': [
                { teamname: 'Ewootz', event: '팀 점심' },
                { teamname: 'TeamFlow', event: '업무 회의' }
            ],
            '2024-11-03': [
                { teamname: '수진이짱', event: '프로젝트 리뷰' }
            ],
            '2024-11-05': [
                { teamname: 'TeamFlow', event: '출장' }
            ],
            '2024-11-06': [
                { teamname: 'Ewootz', event: '디자인 검토' }
            ],
            '2024-11-12': [
                { teamname: 'TeamFlow', event: '고객 미팅' },
                { teamname: '수진이짱', event: '팀 워크숍' }
            ],
            '2024-11-29': [
                { teamname: 'Ewootz', event: '주간 회의' },
                { teamname: 'Ewootz', event: '주간 회의' },

                { teamname: 'Ewootz', event: '주간 회의' },

                { teamname: 'Ewootz', event: '주간 회의' }

            ]
        };
        setEvents(exampleEvents); // 예시 일정 데이터 설정
    }, []);

    const teams = [
        { name: 'TeamFlow', color: '#90C7FA' },
        { name: '수진이짱', color: '#F9D3E7' },
        { name: 'Ewootz', color: '#ECFFCD' },
    ];

    return (
        <div className="white-line">
            <div className="hang">
                <p
                    style={{
                        color: 'black',
                        fontSize: 52,
                        marginTop: '1.6vh',
                        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.4)',
                    }}
                >
                    {title}
                </p>
                <button
                    style={{
                        position: 'absolute',
                        top: '7vh',
                        right: '5vw',
                        width: '3.5vw',  
                        height: '6vh', 
                        borderRadius: '50%',
                        border: 'none',
                        backgroundImage: `url(${userImage})`,  // 사용자 이미지 설정
                        backgroundSize: 'cover',  // 이미지가 버튼에 맞게 크기 조정
                        backgroundPosition: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
                    }}
                    onClick={() => setShowUserPopup(true)} // 클릭 시 새로운 팝업 표시
                ></button>
            </div>

            <div className="hang">
                <Calendar
                    events={events}
                    year={year}
                    month={month}
                    day={day}
                    openPopup={openPopup}
                    onMonthChange={handleMonthChange}
                />
                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content" style={{ width: '22vw', height: '50vh' }}>
                            <div className="hang" style={{ margin: '-1.2vh', justifyContent: 'space-between' }}>
                                <p style={{ fontSize: '18px', fontWeight: '700', paddingLeft: '1vw' }}>
                                    {`${new Date(selectedDate).getMonth() + 1}월 ${new Date(selectedDate).getDate()}일`}
                                </p>
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="close-button"
                                    style={{ color: 'gray' }}
                                >
                                    X
                                </button>
                            </div>
                            <div
                                style={{
                                    maxHeight: '40vh',
                                    overflowY: 'auto',
                                    paddingRight: '1vw',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.9vh',
                                    marginLeft: '1vw',
                                }}
                                className="custom-scrollbar"
                            >
                                {events[selectedDate] &&
                                    events[selectedDate].map((event, index) => {
                                        const teamColor = teams.find(team => team.name === event.teamname)?.color || '#ffffff';
                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    marginLeft: '1vw',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: '18vw',
                                                    height: '3vh',
                                                    padding: '13px',
                                                    borderRadius: '10px',
                                                    backgroundColor: teamColor,
                                                    fontSize: '14px',
                                                    textAlign: 'center',
                                                    margin: '5px auto',
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

                {showUserPopup && (
                    <div className="popup-overlay" style={{
                        position: 'fixed',
                        right: '2vw', // 오른쪽에서 2vw 만큼 떨어지게
                        width: '100vw', // 전체 너비를 100%로 설정
                        height: '100vh', // 전체 높이를 100%로 설정
                        display: 'flex',
                        justifyContent: 'flex-end', // 오른쪽 끝으로 정렬
                        alignItems: 'flex-start', // 위쪽 끝으로 정렬
                        zIndex: 9999, // 다른 요소보다 위에 표시되도록
                    }}>
                        <div className="popup-content" style={{
                            width: '22vw', 
                            height: '50vh', 
                            backgroundColor: '#D6E6F5', 
                            borderRadius: '10px', 
                            marginTop: '11vh', 
                            marginRight: '3vw', 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '2vw',
                        }}>
                            <div className="hang" style={{ margin: '-1.2vh', justifyContent: 'flex-end', width: '100%' }}>
                                <button
                                    onClick={() => setShowUserPopup(false)} 
                                    className="close-button"
                                    style={{ color: 'gray', fontSize: '15px' 
                                    }}
                                > 
                                    X 
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <img 
                                    src={userImage} 
                                    alt="User" 
                                    style={{
                                        width: '6.5vw',  
                                        height: '12vh', 
                                        borderRadius: '50%', 
                                        backgroundColor:'white',
                                        marginBottom: '0.5vh'
                                    }} 
                                />
                           <p style={{ fontWeight: 'bold', margin: '0.5vh' ,fontSize:'22px'}}>{username}</p>
    <p style={{ margin: '2px 0' }}>{useremail}</p>
    <p style={{ margin: '2px 0' }}>{userjob}</p>
    <p style={{ margin: '2px 0' }}>{usertime}</p>
                            </div>
                            <div>
                                <button  className='input-name' style={{width:'20vw',height:'5.5vh',borderRadius: '30px', fontSize:'18px',color:'black',  marginTop: '-5vh'}}> Manage your Account
                                </button>
                                <div>
                                    <div style={{height:'1.3vh'}}></div>
                                <button  className='input-name' style={{width:'20vw',height:'5.5vh',borderRadius: '30px', fontSize:'18px',color:'black'}}> Setting
                                        
                                </button>
                            </div>
                            <div>
                                <button 
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: 'black',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        border: 'none',
                                    }}> sign out your account
                                        
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ width: '3.5vw' }}></div>
                <div className="blue-box" style={{ width: '30vw', height: '60vh', backgroundColor: 'white' }}>
                    <div className="hang">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <button className="square-button" style={{ backgroundColor: teams[0]?.color, margin: '5px' }}></button>
                            <p style={{ marginTop: '5px' }}>{teams[0]?.name}</p>
                        </div>
                        <div style={{ width: '3vw' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <button className="square-button" style={{ backgroundColor: teams[1]?.color, margin: '5px' }}></button>
                            <p style={{ marginTop: '5px' }}>{teams[1]?.name}</p>
                        </div>
                    </div>
                    <div style={{ height: '3vh' }}></div>
                    <div className="hang">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <button className="square-button" style={{ backgroundColor: teams[2]?.color, margin: '5px' }}></button>
                                <p style={{ marginTop: '5px' }}>{teams[2]?.name}</p>
                            </div>
                        </div>
                        <div style={{ width: '3vw' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50%' }}>
                            <button
                                className="square-button"
                                style={{
                                    backgroundColor: '#D9D9D9',
                                    margin: '5px',
                                    transform: 'translateY(-2.8vh)',
                                    fontSize: '40px',
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
                <div style={{ height: '5vh' }}></div>
            </div>
        </div>
    );
}

export default Main;
