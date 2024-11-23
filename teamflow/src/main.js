import './App.css';
import { useEffect, useState } from 'react';
import Calendar from './calendar'; // Calendar 컴포넌트 임포트
import { useNavigate } from 'react-router-dom';

function Main() {
    let title = 'TeamFlow';
    const navigate = useNavigate();

    const [events, setEvents] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [userId, setUserId] = useState('');

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
            '2024-11-01': ['회의 1', '프로젝트 발표'],
            '2024-11-02': ['팀 점심', '업무 회의', 'ss'],
            '2024-11-03': ['프로젝트 리뷰'],
            '2024-11-05': ['출장'],
            '2024-11-06': ['디자인 검토'],
            '2024-11-12': ['고객 미팅', '팀 워크숍', '프로젝트 발표', 'sssss', 'ddd','sssssa','wfadf'],
            '2024-11-15': ['주간 회의'],
            '2024-11-27': ['아아앙','ㄴㄴ','ㄴㄴㄴㄴ','주간 회의'],
        };
        setEvents(exampleEvents); // 예시 일정 데이터 설정
    }, []);



    return (
        <div className="white-line">
            <div className="hang">
                <p
                    style={{
                        color: 'black',
                        fontSize: 53,
                        fontWeight: 'bold',
                        marginTop: '1.6vh',
                        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.4)',
                    }}
                >
                    {title}
                </p>
                <button
                    style={{
                        position: 'absolute',
                        top: '5vh',
                        right: '5vw',
                        width: '3.5vw',
                        height: '6vh',
                        borderRadius: '50%',
                        border: 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
                    }}
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
                                <p style={{fontSize:'18px',fontWeight:'700',paddingLeft:'1vw'}}>{`${new Date(selectedDate).getMonth() + 1}월 ${new Date(selectedDate).getDate()}일`}</p>
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="close-button"
                                    style={{ color: 'gray' }}
                                >
                                    X
                                </button>
                            </div>
                            <div style={{ textAlign: 'left',paddingBottom:'1.7vh',paddingLeft:'1.5vw',fontSize:'17px'}}>{calculateDday(selectedDate)}</div>
                            <div
                                style={{
                                    maxHeight: '40vh',
                                    overflowY: 'auto',
                                    paddingRight: '1vw',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.9vh',
                                    marginLeft:'1vw',

                                }}
                                className="custom-scrollbar"
                            >
                                {events[selectedDate] &&
                                    events[selectedDate].map((event, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                marginLeft:'1vw',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '18vw',
                                                height: '3vh',
                                                padding: '13px',
                                                borderRadius: '10px',
                                                backgroundColor: '#f0f0f0',
                                                fontSize: '14px',
                                                textAlign: 'center',
                                                margin: '5px auto',
                                            }}
                                        >
                                            {event}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
                <div style={{ width: '3.5vw' }}></div>


                <div className="blue-box" style={{ width: '30vw', height: '60vh' }}>
                    <div className="hang">
                        <button style={{ marginBottom: '10px', width: '100%' }}>TeamFlow</button>
                        <button style={{ marginBottom: '10px', width: '100%' }}>Ewootz</button>
                    </div>
                    <div className="hang">
                        <button style={{ marginBottom: '10px', width: '100%' }}>Team3</button>
                        <button style={{ width: '100%' }}>+</button>
                    </div>
                </div>
            </div>
            <div style={{ height: '5vh' }}></div>
        </div>
    );
}

export default Main;
