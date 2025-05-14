import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';  
import Join from './join'; 
import Find from './find';  
import Main from './main';
import Room from "./room";
import Call from './room/call'; 
import MyPage from "./mypage";
import Setting from "./setting";
import axios from 'axios';
axios.defaults.baseURL = 'http://3.37.129.52:8080'; 

const Home= () => {  
  let title = 'TeamFlow';
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const saveUserId = (e) => setId(e.target.value);
  const saveUserPw = (e) => setPw(e.target.value);

  function Login() {
    const formData = {
      userId: id,
      password: pw,
    };
  
    axios.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log("🧾 전체 응답:", response);
        console.log("📦 응답 데이터:", response.data);
  
        const token = response.data.token; 
        if (token) {
          localStorage.setItem("id", id);
          localStorage.setItem("access_token", token);
          console.log("🎟️ 로그인 성공! 발급된 토큰:", token);

          navigate(`/main`);
        } else {
          console.warn("⚠️ token이 응답에 없습니다.");
          Swal.fire({
            icon: "error",
            title: "로그인 실패",
            text: "서버 응답이 예상과 다릅니다.",
          });
        }
      })
      .catch((error) => {
        console.error("❌ 로그인 에러:", error.response || error.message);
        Swal.fire({
          icon: "error",
          title: "로그인 실패",
          text: "아이디나 비밀번호를 다시 확인해주세요.",
        });
      });
  }
  
  
  return (
    <div className='white-line'>
  <p style={{ color: 'black', fontSize: 53, fontWeight: 'bold', marginBottom:'16px',  textShadow: '2px 2px 5px rgba(0, 0, 0, 0.4)'}}>
        {title}</p>
    <div className='blue-box'>
      <div className='gray-box'>
      <div style={{ height: '13vh' }}></div>
        <div className='hang'>
          <p style={{ color: "black", fontSize: '20px',fontWeight:500,paddingLeft:'1vw'  }}>ID</p>
          <div style={{ width: '1vw' }}></div>
          <input
            className='input-name' style={{width:'22vw',fontSize:'17px'}}
            type='text'
            placeholder='아이디를 입력하세요.'
            value={id}
            onChange={saveUserId}
          />
        </div>
        <div style={{ height: '2vh' }}></div>
        <div className='hang'>
          <p style={{ color: "black", fontSize: '20px',fontWeight:500  }}>PW</p>
          <div style={{ width: '1vw' }}></div>
          <input
            className='input-name' style={{width:'22vw',fontSize:'17px'}}
            type='password'
            placeholder='비밀번호를 입력하세요.'
            value={pw}
            onChange={saveUserPw}
          />
        </div>
        <div style={{ height: '5vh' }}></div>
        <button className="login-gray" style={{ fontSize: "30px", fontWeight:500 }} 
 onClick={Login}>
          로그인
        </button>
        <div style={{ height: '8vh' }}></div>
        <button
          className="login-gray"
          style={{ fontSize: "17px", color:'gray'}}
         onClick={() => navigate("/find")}
 >
          아이디 찾기/비밀번호 재설정
        </button>
        <div style={{ height: '3.5vh'}}></div>
        <button
          className="login-gray"
          style={{ fontSize: "17px", color: "gray" }}
          onClick={() => navigate("/join")}
        >
         만약 TeamFlow가 처음이라면?
        </button>
      </div>
      </div>
    </div>
  );
}


const App= () => {
  return (
    <div className='white-line'>
<BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<Join />} />
          <Route path="/find" element={<Find />} />
          <Route path="/main" element={<Main />} />
          <Route path="/room/:teamId" element={<Room />} />
          <Route path="/call/:teamId" element={<Call />} />
          <Route path="/mypage" element={<MyPage />} /> 
          <Route path="/setting" element={<Setting />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
