import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UserPopup = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // 🔹 로그아웃 처리 함수
  const handleLogout = () => {
    Swal.fire({
      title: "로그아웃 하시겠습니까?",
      text: "로그아웃하면 다시 로그인해야 합니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "예",
      cancelButtonText: "아니오"
    }).then((result) => {
      if (result.isConfirmed) {
        // 🔹 로그아웃 처리 (예: 토큰 삭제)
        localStorage.removeItem("access_token");
        
        // 🔹 App.js (로그인 페이지 등)로 이동
        navigate("/");
      }
    });
  };

  return (
    <div className="popup-overlay" style={{ right: '2vw', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
      <div className="popup-content"
        style={{
          width: '22vw', height: '43vh', backgroundColor: '#D6E6F5', borderRadius: '10px',
          marginTop: '11vh', marginRight: '3vw', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-between', padding: '2vw',
        }}>
        <div className="hang" style={{ margin: '-1.2vh', justifyContent: 'flex-end', width: '100%' }}>
          <button onClick={onClose} className="close-button" style={{ color: 'gray', fontSize: '15px' }}> X </button>
        </div>

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

        <div>
          <button 
            className='input-name' 
            style={{ width: '20vw', height: '5.5vh', borderRadius: '30px', fontSize: '18px', color: 'black' }}
            onClick={() => navigate('/mypage')} 
          >
            Manage your Account
          </button>
        </div>
        <div>
          <button 
            style={{
              backgroundColor: 'transparent', color: 'black', border: 'none'
            }}
            onClick={handleLogout} 
          >
            Sign out your account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPopup;
