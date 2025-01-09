import React from 'react';
const TeamCalendar = ({ teamId, userId }) => {
    // 팀과 개인 캘린더 데이터를 가상으로 예시 (실제 데이터를 API에서 가져올 수 있음)
    const teamCalendar = [
      { date: '2024-11-01', event: 'Team Meeting' },
      { date: '2024-11-15', event: 'Team Outing' },
    ];
  
    const userCalendar = [
      { date: '2024-11-03', event: 'One-on-One with Boss' },
      { date: '2024-11-10', event: 'Project Review' },
    ];
  
    return (
      <div>
        <h2>Team Calendar (Team {teamId})</h2>
        <ul>
          {teamCalendar.map((event, index) => (
            <li key={index}>{event.date}: {event.event}</li>
          ))}
        </ul>
  
        <h3>Personal Calendar (User {userId})</h3>
        <ul>
          {userCalendar.map((event, index) => (
            <li key={index}>{event.date}: {event.event}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default TeamCalendar;
  