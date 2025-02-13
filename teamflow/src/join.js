import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';  // axios 라이브러리 추가
import Swal from 'sweetalert2';  
import { useNavigate } from 'react-router-dom';
function Join() {
    let title = 'TeamFlow';
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [repw, setRepw] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isPasswordMatch, setIsPasswordMatch] = useState("");
  
    const saveUserId = event => {
      setId(event.target.value);
      console.log(event.target.value);
    };
  
    const saveUserPw = event => {
      setPw(event.target.value);
      console.log(event.target.value);
    };
  
    const saveUserRepw = event => {
      setRepw(event.target.value);
      console.log(event.target.value);
    };
  
    const saveUserName = event => {
      setName(event.target.value);
      console.log(event.target.value);
    };
    const saveUserEmail = (event) => {
        setEmail(event.target.value);
      };
    useEffect(() => {
      if (repw && pw != repw) {
        setIsPasswordMatch("비밀번호가 일치하지 않습니다.");
      } else {
        setIsPasswordMatch("");
      }
    }, [pw, repw]);
    function idCheck() {
        if (!id) {  // 아이디가 비어있는지 확인
            Swal.fire({
              icon: 'error',
              title: '아이디를 적어주세요',
              text: '아이디를 입력해야 중복확인 할 수 있습니다.',
            });
            return;  // 아이디가 비어있으면 함수 실행을 종료
          }
        
      axios.post(
        `/api/users/duplicate?username=${id}`,
        {
          'headers': { 'Content-Type': 'application/json' }
        }
      ).then((response) => {
        if (response.status == 200) {
          Swal.fire({
            icon: "success",
            text: "사용가능한 아이디입니다!",
        });
        }
      }).catch((error) => {
        Swal.fire({
          icon: "warning",
          title: "이미 존재하는 아이디입니다.",
          text: "다른 아이디를 입력하세요!",
      });
      });
    }
   // 이메일 중복 확인
  const emailCheck = () => {
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: '이메일을 입력해주세요',
        text: '이메일을 입력해야 중복확인을 할 수 있습니다.',
      });
      return;
    }
    axios
      .post(`/api/users/duplicate-email?email=${email}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => {
        Swal.fire({
          icon: 'success',
          text: '사용 가능한 이메일입니다!',
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'warning',
          title: '이미 존재하는 이메일입니다.',
          text: '다른 이메일을 입력하세요!',
        });
      });
  };
    function Signup() {
      if (!id || !pw || !repw || !name) {
        Swal.fire({
          icon: "error",
          title: "회원가입 실패",
          text: "모든 항목을 입력해주세요!",
      });
      } else if (pw !== repw) {
        Swal.fire({
          icon: "warning",
          title: "회원가입 실패",
          text: "비밀번호가 일치하지 않습니다.",
      });
      } else {
        axios.post(
          '/api/users/signup',
          { "username": id, "password": pw, "fullname": name },
          {
            'headers': { 'Content-Type': 'application/json' }
          }
        ).then((response) => {
          if (response.status == 201) {
            Swal.fire({
              icon: "success",
              title: "회원가입 성공!",
              text: "로그인 해주세요!",
          });
            navigate("/");
            console.log("회원가입 성공");
          }
          else {
            Swal.fire({
              icon: "warning",
              title: "회원가입 실패",
          });
          }
        }).catch((error) => {
          console.log(error.response);
          Swal.fire({
            icon: "warning",
            title: "회원가입 실패",
        });
        });
      }
    }
    return (
        <div className='white-line'>
       <p style={{ color: 'black', fontSize: 53, fontWeight: 'bold', marginBottom:'16px',  textShadow: '2px 2px 5px rgba(0, 0, 0, 0.4)'}}    onClick={() => navigate('/')} 
       >
       {title}</p>
          <div className='blue-box'>
            <div className='gray-box'>
              <div className='hang' style={{ paddingLeft: "1vh" }}>
                <p style={{ color: "black", fontSize: '20px',fontWeight:500 }}>ID</p>
                <div style={{ width: '1vw' }}></div>
                <input className='input-name' type='text' placeholder='아이디를 입력하세요.' value={id} onChange={saveUserId} style={{width:'30vw'}} />
                <div style={{ width: '0.6vw' }}></div>
                <button className="login-gray" style={{ fontSize: "15px" }} onClick={() => idCheck()}>중복확인</button>
              </div>
              <div style={{ height: '2vh' }}></div>
              <div className='hang'>
                <p style={{ color: "black", fontSize: '20px',fontWeight:500 }}>PW</p>
                <div style={{ width: '1vw' }}></div>
                <input className='input-name' type='text' placeholder='비밀번호를 입력하세요.' value={pw} onChange={saveUserPw}style={{width:'30vw'}}  />
                <div style={{ width: "4vw",}}></div>
              </div>
              <div className='hang'>
                <p style={{ color: "black", fontSize: '19px',fontWeight:'bold'}}>확인</p>
                <div style={{ width: '0.7vw' }}></div>
                <div>
                  <input className='input-name' type='text' placeholder='비밀번호를 재입력하세요.' value={repw} onChange={saveUserRepw}style={{width:'30vw'}}  />
                  {isPasswordMatch && (
                    <p style={{ color: 'red', fontSize: '10px' }}>{isPasswordMatch}</p>
                  )}
                </div>
                <div style={{ width: "4vw",}}></div>
              </div>
              <div style={{ height: '2vh' }}></div>
              <div className='hang' style={{ paddingLeft: "1vh" }}>
              <p style={{ color: "black", fontSize: '19px',fontWeight:'bold' }}>이메일</p>
              <div style={{ width: '0.75vw' }}></div>
                <input className='input-name' type='text' placeholder='이메일을 입력하세요.' value={email} onChange={saveUserEmail} style={{width:'30vw'}} />
                <div style={{ width: '0.6vw' }}></div>
                <button className="login-gray" style={{ fontSize: "15px",paddingRight:'2vw' }} onClick={() => emailCheck() }>중복확인</button>
              </div>
              <div style={{ height: '5vh' }}></div>
              <div className='hang'>
                <p style={{ color: "black", fontSize: '19px',fontWeight:'bold' }}>이름</p>
                <div style={{ width: '0.7vw' }}></div>
                <input className='input-name' type='text' placeholder='이름을 입력하세요.' value={name} onChange={saveUserName}style={{width:'30vw'}}  />
                <div style={{ width: "4vw",}}></div>
              </div>
              
              <div className='hang'>
                <button className="login-gray" style={{ fontSize: "25px",paddingTop:"1.5vh" }} onClick={() => Signup()}>가입하기</button>
              </div>
            </div>
          </div>
        </div>
    );
  }
  
  export default Join;