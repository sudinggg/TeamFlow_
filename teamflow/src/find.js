import './App.css';
import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa'; // react-icons 아이콘 사용
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios'; // axios 라이브러리 추가

function Find() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(''); // 서버에서 받은 user ID 저장
  const [isEmailValid, setIsEmailValid] = useState(false); // 이메일 유효성 검사 상태 추가
  const [password, setPassword] = useState(""); // 비밀번호 상태 추가
  const [currentView, setCurrentView] = useState('default'); // 현재 화면 상태 관리
  const title = 'TeamFlow';
  const navigate = useNavigate();

  // 아이디 찾기 (이메일로 사용자 ID 확인)
  const emailCheckFindId = async () => {
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: '이메일을 입력해주세요',
        text: '이메일을 입력해야 아이디를 찾을 수 있습니다.',
      });
      return;
    }

    try {
      const response = await axios.post(`/api/users/find-id`, { email }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        const { id } = response.data;
        if (id) {
          setUserId(id); // 서버에서 받은 ID를 상태에 저장
          setShowPopup(true); // 사용자 ID 팝업 표시
        } else {
          Swal.fire({
            icon: 'error',
            title: '사용자를 찾을 수 없습니다',
            text: '해당 이메일로 등록된 계정이 없습니다.',
          });
        }
      }
    } catch (error) {
        setShowPopup(true); // 사용자 ID 팝업 표시

      Swal.fire({
        icon: 'error',
        title: '오류가 발생했습니다',
        text: '잠시 후 다시 시도해주세요.',
      });
    }
  };

  // 비밀번호 재설정 (이메일로 비밀번호 재설정)
  const emailCheckResetPassword = async () => {
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: '이메일을 입력해주세요',
        text: '이메일을 입력해야 비밀번호를 재설정할 수 있습니다.',
      });
      return;
    }

    const isEmailAvailable = email === "a"; // 예시 이메일만 유효하다고 가정

    if (isEmailAvailable) {
      setIsEmailValid(true); // 이메일이 유효한 경우
    } else {
      setIsEmailValid(false); // 이메일이 유효하지 않으면 비밀번호 재설정을 막음
      Swal.fire({
        icon: 'error',
        title: '이메일이 등록되지 않았습니다.',
        text: '입력하신 이메일로 등록된 계정이 없습니다. 다시 확인해주세요.',
      });
          }
  };

  // 아이디 찾기 화면
  const renderFindId = () => (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <input
        className="input-name"
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '20vw', padding: '10px', marginBottom: '2vw' }}
      />
      <button
        className="login-gray"
        style={{ fontSize: 18, padding: '1vw 2vw' }}
        onClick={emailCheckFindId}
      >
        아이디 찾기
      </button>
      <p style={{ color: 'gray' }}>가입 시 등록한 이메일 주소를 입력해주세요!</p>
    </div>
  );

  // 비밀번호 재설정 화면
  const renderResetPassword = () => (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <div className='hang' style={{ paddingLeft: "1vh" }}>
        <div style={{ width: '0.75vw' }}></div>
        <input
          className='input-name'
          type='email'
          placeholder='이메일을 입력하세요.'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '21.5vw', padding: '10px', marginBottom: '10px' }}
        />
        <div style={{ width: '0.6vw' }}></div>
        <button
          className="login-gray"
          style={{ fontSize: "15px", paddingRight: '2vw' }}
          onClick={emailCheckResetPassword}
        >
           확인
        
        </button>
      </div>

      {/* 이메일이 유효한 경우에만 비밀번호 입력란을 표시 */}
      {isEmailValid && (
        <>
          <input
            className="input-name"
            type="password"
            placeholder="새로운 비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '24.5vw', padding: '10px', marginBottom: '10px' }}
          />
          <p style={{ color: 'gray' }}>새로운 비밀번호를 입력해주세요.</p>
          <button
            className="login-gray"
            style={{ fontSize: 18, padding: '10px 20px' }}
            onClick={() => Swal.fire({
                icon: 'success',
                title: '비밀번호가 재설정되었습니다!',
                text: '새로운 비밀번호로 로그인해 주세요.',
              })}          >
            비밀번호 재설정
          </button>
        </>
      )}
    </div>
  );

  // 기본 화면
  const renderDefault = () => (
    <div className="hang" style={{ paddingLeft: '1vh' }}>
      <button
        className="input-name"
        style={{width: '15vw',height: '30vh',display: 'flex',alignItems: 'center',justifyContent: 'center',gap: '10px',flexDirection: 'column', 
          textAlign: 'center', }}
        onClick={() => setCurrentView('findId')}
      >
        <FaUser size={32} color="#555" />
        <span style={{ fontSize: '17px', color: '#555',padding:'0.2vw' }}>아이디 찾기</span> 

      </button>
      <div style={{ width: '3.5vw' }}></div>
      <button
        className="input-name"
        style={{
          width: '15vw',
          height: '30vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',    textAlign: 'center',
          gap: '10px',
        }}
        onClick={() => setCurrentView('resetPassword')}
        
      >
        <FaLock size={32} color="#555" />
        <span style={{ fontSize: '17px', color: '#555' ,padding:'0.2vw'}}>비밀번호 재설정</span> 

      </button>
      <div style={{ width: '0.6vw' }}></div>
    </div>
  );

  return (
    <div className="white-line">
      <p
        style={{
          color: 'black',
          fontSize: 53,
          fontWeight: 'bold',
          marginBottom: '16px',
          textShadow: '2px 2px 5px rgba(0, 0, 0, 0.4)',
        }}
        onClick={() => navigate('/')}
      >
        {title}
      </p>
      <div className="blue-box">
        <div className="gray-box">
          {currentView === 'default' && renderDefault()}
          {currentView === 'findId' && renderFindId()}
          {currentView === 'resetPassword' && renderResetPassword()}
        </div>
      </div>
      {showPopup && currentView === 'findId' && (
        <div className="popup-overlay">
          <div className="popup-content" style={{width:'38vw',height:'30vh'}}>
            <button
              onClick={() => setShowPopup(false)}
              className="close-button"
              style={{ paddingLeft: '35vw',paddingTop:'1vh', color: 'gray' }}>
              X
            </button>
            <div style={{ height: '5vh' }}></div>
            <div className="hang" style={{ alignItems: 'center', justifyContent: 'center', gap: '1vw' }}>
              <FaUser size={32} color="gray" />
              <p
                className="input-name"
                style={{
                    backgroundColor: '#ECECEC', 
                    width:'30vw',
                  color: 'black',
                  padding: '10px',
                  borderRadius: '15px',
                }}
              >
                {userId}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Find;
