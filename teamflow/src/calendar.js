import React from 'react';

function Calendar({ events, year, month, day, openPopup, onMonthChange }) {
    const generateCalendar = () => {
        const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 시작 요일
        const daysInMonth = new Date(year, month, 0).getDate(); // 해당 월의 총 일수
        const dates = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            dates.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            dates.push(i);
        }
        return dates;
    };

    const dates = generateCalendar();

    const getDayColor = (index) => {
        if (index === 0) return 'red';  // 일요일
        if (index === 6) return 'blue'; // 토요일
        return 'black'; // 평일은 검정색
    };

    return (
        <div
            className="blue-box"
            style={{
                width: '42vw',
                height: '82vh',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '-4.2vh',
            }}
        >
            <div className="hang" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5vw' }}>
                <button
                    onClick={() => onMonthChange(-1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '23px', color: 'gray' }}
                >
                    &lt;
                </button>
                <p
                    style={{
                        margin: '0',
                        fontSize: '23px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}
                >
                    {year}년 {month}월
                </p>
                <button
                    onClick={() => onMonthChange(1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '23px', color: 'gray' }}
                >
                    &gt;
                </button>
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4.3vw',
                    textAlign: 'center',
                    paddingBottom: '0.3vh'
                }}
            >
                {['일', '월', '화', '수', '목', '금', '토'].map((weekday, index) => (
                    <div
                        key={index}
                        style={{
                            fontWeight: 'bold',
                            color: getDayColor(index),
                        }}
                    >
                        {weekday}
                    </div>
                ))}
            </div>
        
            <div
                style={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    textAlign: 'center',
                    gap: '0.4vw',
                    fontSize:'15px'
                }}
            >
                {dates.map((date, index) => {
                    const formattedDate = date
                        ? `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`
                        : null;
                    const isToday = date === day && year === new Date().getFullYear() && month === new Date().getMonth() + 1;
                    const dateEvents = events[formattedDate] || [];
                    const dayColor = getDayColor(new Date(year, month - 1, date).getDay());  // 날짜 색을 요일에 맞게 설정
                    return (
                        <div
                            key={index}
                            onClick={() => date && openPopup(formattedDate)} // 날짜 클릭 시 팝업 열기
                            style={{
                                backgroundColor: 'transparent',
                                paddingTop: '0.3vh', 
                                paddingBottom: '0.4vh',
                                paddingLeft: '0.5vw',
                                paddingRight: '0.5vw',
                                width: '4vw',
                                height: '4vh', // 높이를 고정하여 보기 편하게 수정
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                cursor: date ? 'pointer' : 'default',
                                color: dayColor,  // 날짜 색상 적용
                            }}
                        >
                            {date && (
                                <span
                                    style={{
                                        fontWeight: 'bold',
                                        position: 'relative',
                                    }}
                                >
                                    {isToday && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '-0.25vw',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '30px',
                                                height: '30px',
                                                backgroundColor: '#ffc107',
                                                borderRadius: '50%',
                                            }}
                                        ></div>
                                    )}
                                    <span style={{ position: 'relative', zIndex: 1 }}>{date}</span>
                                </span>
                            )}

                            {dateEvents.slice(0, 3).map((event, eventIndex) => {
                                if (!event) return null; // 이벤트가 없으면 렌더링하지 않음
                                const truncatedEvent =
                                    event.length > 5 ? `${event.slice(0, 5)}...` : event; // 문구 길이 제한
                                return (
                                    <span
                                        key={eventIndex}
                                        style={{
                                            width: '4.3vw',
                                            fontSize: '11px',
                                            backgroundColor: '#e9ecef',
                                            borderRadius: '4px',
                                            padding: '1px 2px',
                                            marginTop: '0.6vh',
                                            color: 'black', // 업무 내용 텍스트를 항상 검정색으로 설정
                                        }}
                                    >
                                        {truncatedEvent}
                                    </span>
                                );
                            })}

                            {dateEvents.length > 3 && (
                                <span
                                    style={{
                                        fontSize: '11px',
                                        color: '#007bff',
                                        cursor: 'pointer',
                                        marginTop: '0.1vh',
                                    }}
                                >
                                    +{dateEvents.length - 3} more
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Calendar;
