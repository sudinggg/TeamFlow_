import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';  // axios 라이브러리 추가
import Swal from 'sweetalert2';  // sweetalert2로 오류 메시지 처리
import Join from './join'; 
import Find from './find';  
import Main from './main';
import Room from "./room";

const Home= () => {  
  let title = 'TeamFlow';
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const saveUserId = (e) => setId(e.target.value);
  const saveUserPw = (e) => setPw(e.target.value);

  const teams = [
    { id: "1", name: "팀A", color: "#FF5733", member: ["김수진", "이영희"] },
    { id: "2", name: "팀B", color: "#33FF57", member: ["박준호", "김민수"] },
];

function Login() {
  // 로그인 요청 시 콘솔로 입력된 값 확인
  console.log("로그인 시도:", id, pw);
  // 실제 로그인 로직 추가 (서버와의 통신)
  axios.post('/api/auth/token', {
    username: id,
    password: pw
  })
  .then((response) => {
    if (response.status === 200) {
      localStorage.setItem('id', id);
      localStorage.setItem('access_token', response.data.access_token);
      navigate(`/main/${id}`);  // 로그인 후 메인 페이지로 이동
      console.log("로그인 성공");
    } else {
      Swal.fire({
        icon: 'error',
        title: '로그인 실패',
        text: '아이디나 패스워드를 다시 확인해주세요!',
      });
    }
  })
  .catch((error) => {
    console.error('로그인 요청 오류:', error);
    Swal.fire({
      icon: 'error',
      title: '로그인 실패',
      text: '아이디나 패스워드를 다시 확인해주세요!',
    });
  });
};

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
        <button className="login-gray" style={{ fontSize: "30px", fontWeight:500 }} onClick={() => navigate("/main")}
 /*onClick={Login}*/>
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


          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
