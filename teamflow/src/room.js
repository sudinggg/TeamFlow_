import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // useNavigate도 임포트

const Room = () => {
  const { teamId } = useParams();  // URL에서 teamId를 가져옵니다.
  const navigate = useNavigate();  // navigate 훅을 사용하여 페이지 이동

  // 임시 데이터: 실제로는 서버에서 가져오는 방식으로 사용될 수 있습니다.
  const teams = [
    { id: '1', name: 'Team A', color: 'red', member: ['Alice', 'Bob'] },
    { id: '2', name: 'Team B', color: 'blue', member: ['Charlie', 'David'] },
    { id: '3', name: 'Team C', color: 'green', member: ['Eve', 'Frank'] },
  ];

  // teamId에 해당하는 팀 찾기
  const team = teams.find((team) => team.id === teamId);

  if (!team) {
    return <div>팀을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <h1>{team.name}의 방</h1>
      <div>팀 색상: <span style={{ color: team.color }}>{team.color}</span></div>
      <div>팀 멤버: {team.member.join(', ')}</div>

      {/* 예시: 다른 페이지로 이동하는 버튼 */}
      <button onClick={() => navigate('/')}>Home으로 이동</button>
    </div>
  );
};

export default Room;
