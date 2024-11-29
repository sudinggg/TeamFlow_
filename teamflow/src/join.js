import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Chatting from './room/chatting';
import TeamCalendar from './room/teamcalendar';
import Meeting from './room/meeting';
import DM from './room/dm';
import File from './room/file';

const Room = () => {
  const { teamId } = useParams();  // URL에서 teamId를 받아옵니다.
  const [activeSection, setActiveSection] = useState('chatting'); // 활성화된 섹션 상태
  const [dropdowns, setDropdowns] = useState({
    dm: false,
    meeting: false,
  });  // DM과 Meeting 드롭다운 상태 관리

  // 임시 팀 데이터 (실제 API 호출로 대체할 수 있습니다)
  const teams = [
    { id: '1', name: 'Team A', color: 'red', member: ['Alice', 'Bob'] },
    { id: '2', name: 'Team B', color: 'blue', member: ['Charlie', 'David'] },
    { id: '3', name: 'Team C', color: 'green', member: ['Eve', 'Frank'] },
  ];

  // 임시 사용자 데이터 (로그인한 사용자 정보)
  const userId = 'Alice';  // 예시로 'Alice'가 로그인한 사용자라고 가정

  // 팀을 찾을 수 없는 경우 렌더링을 먼저 처리
  const team = teams.find((team) => team.id === teamId);  // teamId로 팀 찾기

  if (!team) {
    return <div>팀을 찾을 수 없습니다.</div>;
  }

  // 드롭다운 토글 함수
  const toggleDropdown = (section) => {
    setDropdowns((prev) => ({
      ...prev,
      [section]: !prev[section],  // 선택된 섹션만 토글
    }));
  };

  // 드롭다운 항목 클릭 함수
  const handleDropdownItemClick = (section, item) => {
    setActiveSection(`${section}_${item}`);  // 클릭한 항목의 섹션과 아이템 정보 저장
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* 왼쪽 사이드바 */}
      <div
        className="blue-box"
        style={{ height: '100vh', width: '21vw', borderRadius: '0px', float: 'left' }}
      >
        <div className="hang" style={{ paddingRight: '3vw' }}>
          <div
            className="input-name"
            style={{
              height: '5.5vh',
              width: '2.3vw',
              borderRadius: '10px',
              backgroundColor: team.color || 'transparent',
              marginRight: '1vw',
            }}
          ></div>
          <h1>{team.name}</h1>
        </div>

        <div style={{ height: '5vh' }}></div>
        <div
          style={{
            height: '70vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <button onClick={() => setActiveSection('chatting')}>chatting</button>
          <button onClick={() => setActiveSection('teamcalendar')}>teamcalendar</button>
          {/* Meeting 드롭다운 버튼 */}
          <div style={{ marginBottom: '1rem' }}>
            <button onClick={() => toggleDropdown('meeting')}>Meeting</button>
            {dropdowns.meeting && (
              <ul style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
                <li onClick={() => handleDropdownItemClick('meeting', '2024.11.07')}>2024.11.07</li>
                <li onClick={() => handleDropdownItemClick('meeting', '2024.11.14')}>2024.11.14</li>
              </ul>
            )}
          </div>
          {/* DM 드롭다운 버튼 */}
          <div style={{ marginBottom: '1rem' }}>
            <button onClick={() => toggleDropdown('dm')}>DM</button>
            {dropdowns.dm && (
              <ul style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
                <li onClick={() => handleDropdownItemClick('dm', 'Sudding')}>Sudding</li>
                <li onClick={() => handleDropdownItemClick('dm', 'Yevvon')}>Yevvon</li>
              </ul>
            )}
          </div>

          <button onClick={() => setActiveSection('file')}>file</button>
        </div>

        <div>
          <button onClick={() => setActiveSection('member')}>member</button>
          {activeSection === 'member' && <div>팀 멤버: {team.member.join(', ')}</div>}
        </div>
      </div>

      {/* 오른쪽 페이지: 선택된 콘텐츠 표시 */}
      <div
        className="blue-box"
        style={{
          height: '100vh',
          width: '79vw',
          borderRadius: '0px',
          backgroundColor: 'pink',
        }}
      >
        {activeSection === 'chatting' && <Chatting teamId={team.id} />}
        {activeSection === 'teamcalendar' && <TeamCalendar teamId={team.id} userId={userId} />}
        {activeSection.startsWith('dm') && <DM selectedItem={activeSection.split('_')[1]} teamId={team.id} />}
        {activeSection.startsWith('meeting') && <Meeting selectedItem={activeSection.split('_')[1]} teamId={team.id} />}
        {activeSection === 'file' && <File teamId={team.id} />}
      </div>
    </div>
  );
};

export default Room;
