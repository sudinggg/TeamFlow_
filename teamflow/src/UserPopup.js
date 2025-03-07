import React from "react";

const UserPopup = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null; // 팝업이 열려있지 않다면 렌더링하지 않음

  return (
    <div className="popup-overlay" style={{ right: '2vw', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
      <div className="popup-content"
        style={{
          width: '22vw', height: '50vh', backgroundColor: '#D6E6F5', borderRadius: '10px',
          marginTop: '11vh', marginRight: '3vw', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-between', padding: '2vw',
        }}>
        {/* 닫기 버튼 */}
        <div className="hang" style={{ margin: '-1.2vh', justifyContent: 'flex-end', width: '100%' }}>
          <button onClick={onClose} className="close-button" style={{ color: 'gray', fontSize: '15px' }}> X </button>
        </div>

        {/* 사용자 정보 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img
            src={user.image} alt="User"
            style={{ width: '6.5vw', height: '12vh', borderRadius: '50%', backgroundColor: 'white', marginBottom: '0.5vh' }}
          />
          <p style={{ fontWeight: 'bold', margin: '0.5vh', fontSize: '22px' }}>{user.name}</p>
          <p style={{ margin: '2px 0' }}>{user.email}</p>
          <p style={{ margin: '2px 0' }}>{user.job}</p>
          <p style={{ margin: '2px 0' }}>{user.time}</p>
        </div>

        {/* 계정 관리 및 설정 */}
        <div>
          <button className='input-name' style={{ width: '20vw', height: '5.5vh', borderRadius: '30px', fontSize: '18px', color: 'black', marginTop: '-5vh' }}>
            Manage your Account
          </button>
          <div style={{ height: '1.3vh' }}></div>
          <button className='input-name' style={{ width: '20vw', height: '5.5vh', borderRadius: '30px', fontSize: '18px', color: 'black' }}>
            Setting
          </button>
        </div>

        {/* 로그아웃 버튼 */}
        <div>
          <button style={{
            backgroundColor: 'transparent', color: 'black', paddingTop: '2vh',
            borderRadius: '5px', border: 'none'
          }}>
            Sign out your account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPopup;
