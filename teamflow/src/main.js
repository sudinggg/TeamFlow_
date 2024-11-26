import './App.css';
import { useEffect, useState } from 'react';
import Calendar from './calendar'; 
import { useNavigate } from 'react-router-dom';
import { HexColorPicker } from 'react-colorful'; // react-colorful 추가

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
    const [teamName, setTeamName] = useState('');
    const [teamColor, setTeamColor] = useState('#000000'); // 초기 색상: 검정
    const [teamMembers, setTeamMembers] = useState([]);
    const [colorPickerVisible, setColorPickerVisible] = useState(false); 

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
 const addTeam = () => {
        if (teamName && teamColor) {
            teams.push({ name: teamName, color: teamColor });
            setTeamName('');
            setTeamColor('#000000');
            setTeamMembers([]);
            setTeamMakePopup(false);
        } else {
            alert('팀 이름과 색상을 입력해주세요.');
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
                <Calendar  events={events}  year={year}   month={month}    day={day} openPopup={openPopup}    onMonthChange={handleMonthChange}      />
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
                                        const teamColor = teams.find(team => team.name === event.teamname)?.color || '#ffffff';
                                        return (
                                            <div
                                                key={index}
                                                style={{  marginLeft: '1vw', display: 'flex', justifyContent: 'center',  alignItems: 'center', width: '18vw',height: '3vh',
                                                    padding: '13px', borderRadius: '10px', backgroundColor: teamColor, fontSize: '14px',  textAlign: 'center', margin: '5px auto',
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
                    <div className="popup-overlay" style={{ right: '2vw', justifyContent: 'flex-end', alignItems: 'flex-start',     }}>
                        <div className="popup-content" style={{
                            width: '22vw',   height: '50vh',  backgroundColor: '#D6E6F5',  borderRadius: '10px', 
                            marginTop: '11vh', marginRight: '3vw', display: 'flex',   flexDirection: 'column',alignItems: 'center',
                            justifyContent: 'space-between',  padding: '2vw',
                        }}>
                            <div className="hang" style={{ margin: '-1.2vh', justifyContent: 'flex-end', width: '100%' }}>
                                <button
                                    onClick={() => setShowUserPopup(false)} 
                                    className="close-button"  style={{ color: 'gray', fontSize: '15px'   }}
                                >      X 
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <img 
                                    src={userImage}   alt="User" 
                                    style={{   width: '6.5vw',  height: '12vh', borderRadius: '50%', backgroundColor:'white', marginBottom: '0.5vh'}} 
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
                                        backgroundColor: 'transparent',
                                        color: 'black',
                                        paddingTop: '2vh',
                                        borderRadius: '5px',
                                        border: 'none',
                                    }}> sign out your account
                                        
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                )}
                   {showTeamMakePopup && (
                <div className="popup-overlay">
                    <div className="popup-content" style={{ width: '33vw', height: '64vh', backgroundColor: '#D6E6F5' }}>
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

                            {/* Team name input */}
                            <div className="input-name" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30vw', height: '5.8vh', borderRadius: '27px', margin: '0.3vw' }}>
                                <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ color: 'black' }}>
                                        Team name :
                                    </div>
                                    <div style={{ width: '0.4vw' }}></div>
                                    <div className="input-name" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', width: '20vw', height: '5.8vh', fontSize: '13px' }}>생성할 팀명을 입력해주세요</div>
                                </div>
                            </div>

                            {/* Team color input */}
                            <div className="input-name" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30vw', height: '5.8vh', borderRadius: '27px', margin: '0.3vw' }}>
                                <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ color: 'black' }}>
                                        Team color :
                                    </div>
                                    <div style={{ width: '0.4vw' }}></div>
                                    <div className="input-name" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', width: '18.5vw', height: '5.8vh', fontSize: '13px' }}>
                                        좌측 아이콘을 눌러 팀 색을 선택해주세요
                                    </div>
                                    <div>
                                        <button
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '2.6vw',
                                                height: '5vh',
                                                borderRadius: '100px',
                                                backgroundColor: teamColor, // 선택된 색상 반영
                                                border: 'none',
                                            }}
                                            onClick={() => setColorPickerVisible(!colorPickerVisible)} // 색상 선택기 토글
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Team member input */}
                            <div className="input-name" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30vw', height: '5.8vh', borderRadius: '27px', margin: '0.3vw' }}>
                                <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ color: 'black' }}>
                                        Team member :
                                    </div>
                                    <div style={{ width: '0.4vw' }}></div>
                                    <div className="input-name" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', width: '19vw', height: '5.8vh', fontSize: '13px' }}>
                                        검색할 ID를 입력해주세요
                                    </div>
                                </div>
                            </div>

                            {/* Team member list */}
                            <div className="input-name" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', width: '30vw', height: '33vh', borderRadius: '27px', marginTop: '1vh' }}>
                                <div className="input-name" style={{ margin: '0.5vw', width: '28vw', height: '33vh' }}>
                                    리스트
                                </div>
                                <div>
                                    <p style={{ fontSize: '10px', textAlign: 'left' }}>team member 추가 설정은 나중에도 가능합니다</p>
                                </div>
                            </div>
                        </div>

                        {/* Color Picker (if visible) */}
                        {colorPickerVisible && (
                            <div style={{ position: 'absolute', top:'18vh',right:'15vw',zIndex: 10 }}>
                                <HexColorPicker color={teamColor} onChange={setTeamColor} />
                            </div>
                        )}

                        {/* Confirm button */}
                        <div>
                            <button
                                className="input-name"
                                style={{ color: 'black', width: '7vw', height: '4.5vh' }}
                                onClick={addTeam} // 팀 추가 버튼 클릭 시 addTeam 함수 실행
                            >
                                confirm
                            </button>
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
                    </div> <div style={{ height: '3vh' }}></div>
                    <div className="hang">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <button className="square-button" style={{ backgroundColor: teams[2]?.color, margin: '5px' }}></button>
                                <p style={{ marginTop: '5px' }}>{teams[2]?.name}</p>
                            </div>
                        </div>  <div style={{ width: '3vw' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50%' }}>
                            <button    className="square-button"  style={{
                                    backgroundColor: '#D9D9D9',
                                    margin: '5px',
                                    transform: 'translateY(-2.8vh)',
                                    fontSize: '40px',
                                }}    onClick={() => setTeamMakePopup(true)} > + </button>                
                                   

                        </div>
                    </div>
                </div>
                <div style={{ height: '5vh' }}></div>
            </div>
        </div>
    );
}

export default Main;
