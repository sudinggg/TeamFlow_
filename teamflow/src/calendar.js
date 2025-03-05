import React from 'react';

function Calendar({ events, year, month, day, openPopup, onMonthChange, teams, userColor }) {
    const generateCalendar = () => {
        const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate(); 
        const dates = [];
        for (let i = 0; i < firstDayOfMonth; i++) {dates.push(null);}
        for (let i = 1; i <= daysInMonth; i++) {dates.push(i);}
        return dates;
    };

    const dates = generateCalendar();

    const getDayColor = (index) => {
        if (index === 0) return 'red'; 
        if (index === 6) return 'blue';
        return 'black'; 
    };

    return (
        <div className="blue-box"
            style={{
                width: '42vw', height: '80vh', display: 'flex',
                flexDirection: 'column', marginTop: '-4.2vh',
            }}>
            <div className="hang" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7vw' }}>
                <button onClick={() => onMonthChange(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '23px', color: 'gray' }}> &lt;</button>
                <p style={{ margin: '0', fontSize: '22px', fontWeight: 'bold', textAlign: 'center' }}>
                    {year}년 {month}월
                </p>
                <button onClick={() => onMonthChange(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '23px', color: 'gray' }}> &gt; </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4.3vw', textAlign: 'center', paddingBottom: '0.3vh' }}>
                {['일', '월', '화', '수', '목', '금', '토'].map((weekday, index) => (
                    <div key={index} style={{ fontWeight: 'bold', color: getDayColor(index) }}>
                        {weekday}
                    </div>
                ))}
            </div>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '0.4vw', fontSize: '15px' }}>
                {dates.map((date, index) => {
                    const formattedDate = date
                        ? `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`
                        : null;
                    const isToday = date === day && year === new Date().getFullYear() && month === new Date().getMonth() + 1;
                    const dateEvents = events[formattedDate] || [];
                    const dayColor = getDayColor(new Date(year, month - 1, date).getDay());

                    return (
                        <div
                            key={index}
                            onClick={() => date && openPopup(formattedDate)} 
                            style={{
                                backgroundColor: 'transparent',
                                paddingTop: '0.1vh', paddingBottom: '0.4vh', paddingLeft: '0.5vw', paddingRight: '0.5vw',
                                width: '4vw', height: '3vh', display: 'flex', flexDirection: 'column',
                                justifyContent: 'flex-start', alignItems: 'center',
                                cursor: date ? 'pointer' : 'default', color: dayColor,
                            }}
                        >
                            {date && (
                                <span style={{ fontWeight: 'bold', position: 'relative' }}>
                                    {isToday && (
                                        <div style={{
                                            position: 'absolute', top: '-0.05vw', left: '50%',
                                            transform: 'translateX(-50%)', width: '23px', height: '23px',
                                            backgroundColor: '#ffc107', borderRadius: '50%',
                                        }}></div>
                                    )}
                                    <span style={{ position: 'relative', zIndex: 1 }}>{date}</span>
                                </span>
                            )}

{dateEvents.slice(0, 3).map((event, eventIndex) => {
    if (!event) return null;

    const truncatedEvent = event.event.length > 5 ? `${event.event.slice(0, 5)}...` : event.event;

    // 🔹 팀 일정이면 팀 색상, 개인 일정이면 userColor 적용
    const eventColor = event.teamname === '개인 일정' ? userColor : 
        (teams && teams.find(team => team.name === event.teamname)?.color) || '#ffffff';

    return (
        <span
            key={eventIndex}
            style={{
                width: '4.4vw',
                fontSize: '11px',
                backgroundColor: eventColor, // 🔹 개인 일정은 userColor 적용
                borderRadius: '4px',
                padding: '1px 2px',
                marginTop: '0.65vh',
                color: 'black',
            }}
        >
            {truncatedEvent}
        </span>
    );
})}


                            {dateEvents.length > 3 && (
                                <span style={{ fontSize: '11px', color: '#007bff', cursor: 'pointer', marginTop: '0.11vh' }}>
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
