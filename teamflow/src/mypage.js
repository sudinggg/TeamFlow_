import './App.css';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';  
import { useNavigate } from 'react-router-dom';
import { HexColorPicker } from "react-colorful";  // npm install react-colorful 필요
import axios from 'axios';

const users = [
    { id: "1", name: "김수진", email: "user@naver.com", job: "프론트엔드", time: "10:00~18:00", color: "#FFC0CB", image: "https://via.placeholder.com/100" }
];

const userId = "1"; 
const loggedInUser = users.find(user => user.id === userId);

function MyPage() {
    let title = 'MyPage';
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [job, setJob] = useState("");
    const [time, setTime] = useState("");
    const [teamColor, setTeamColor] = useState("#D9D9D9");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [colorPickerVisible, setColorPickerVisible] = useState(false)
   
    useEffect(() => {
        const token = localStorage.getItem("access_token");

        axios.get('/api/user/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response => {
            const data = response.data;
            setName(data.username ?? "");
            setEmail(data.email ?? "");
            setJob(data.position ?? "");
            setTime(data.contactTime ?? "");
            setTeamColor(data.myColor ?? "#ffffff");
            setPreview(data.profile ?? "");
            console.log(" 토큰:", token);

            console.log(" get 사용자 정보 조회 성공:", response);

        })
        .catch(error => {
            console.error("❌ get 사용자 정보 조회 실패:", error);
        });
    }, []);


    const uploadImageToS3 = async (file) => {
        const token = localStorage.getItem('access_token');
        const formData = new FormData();
        formData.append('image', file);
        console.log("✅ 토큰 확인:", token);
        console.log(file); // ✅ null or undefined가 아니어야 함

        try {
          const res = await axios.post('/api/profile/image', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
        }
          });
          return res.data.fileUrl;  // ← S3에서 온 URL 반환
        } catch (err) {
          console.error("❌ 이미지 업로드 실패:", err);
          return null;
        }
      };
      
      const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          setImage(file);
          
          const uploadedUrl = await uploadImageToS3(file);
          if (uploadedUrl) {
            setPreview(uploadedUrl); // 미리보기 이미지 → 업로드된 URL로
          }
        }
      };
      
    
    const handleSave = () => {
        const token = localStorage.getItem("access_token");
    
        axios.patch('/api/user/profile',
            {
                username: name,
                email: email,
                position: job,
                contactTime: time,
                myColor: teamColor,
                profile: preview,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            }
        )
        .then(response => {
            Swal.fire({
                icon: "success",
                title: "수정 완료!",
                text: "정보가 저장되었습니다.",
            }).then(() => {
                navigate('/main');
            });
            console.log("서버 응답:", response);
        })
        .catch(error => {
            console.error("❌ 사용자 정보 수정 실패:", error);
            Swal.fire({
                icon: "error",
                title: "수정 실패",
                text: "정보 수정 중 오류가 발생했습니다.",
            });
        });
    };
    
    return (
        <div className='white-line'>
            <p 
                style={{ color: 'black', fontSize: 53, fontWeight: 'bold', marginBottom: '16px', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.4)' }} 
                onClick={() => navigate('/main')}
            >
                {title}
            </p>
            <div className='blue-box' style={{ height: "73vh" }}>
                <div className='gray-box' style={{ height: "61vh" }}>
                    <div className='hang' style={{ paddingLeft: "9vw", display: "flex", flexDirection: "row", alignItems: "center" }}>
                    {preview && (
        <img src={preview} alt="프로필 사진" style={{ width: "100px", height: "100px", borderRadius: "50%", marginBottom: "1vw" }} />
    )}                    <div style={{ width: '1.9vw' }}></div>

    <label htmlFor="file-upload" className="custom-file-upload">
        파일 선택
    </label>
    <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} />
</div>
                    <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', paddingLeft: '1vw' }}>
                    <p style={{ color: "black", fontSize: '19px',fontWeight:'bold' }}>이름</p>
                    <div style={{ width: '1.9vw' }}></div>
                    <div className="input-name" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30vw', height: '5.8vh', borderRadius: '27px', margin: '0.3vw' }}>
                            <div className="input-name" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', width: '28vw', height: '5.8vh', fontSize: '13px' }}>
                                <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder={loggedInUser?.name} style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent' }} />
                            </div>
                        </div>
                    </div>
                    <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center' }}>
                    <p style={{ color: "black", fontSize: '19px',fontWeight:'bold' }}>이메일</p>
                    <div style={{ width: '1.8vw' }}></div>
                    <div className="input-name" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30vw', height: '5.8vh', borderRadius: '27px', margin: '0.3vw' }}>
                    
                    <div className="input-name" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', width: '28vw', height: '5.8vh', fontSize: '13px' }}>
                    <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder={loggedInUser?.email} style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent' }} />
                            </div>
                        </div>
                    </div>

                    <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center',paddingLeft: "1.5vw"}}>
                    <p style={{ color: "black", fontSize: '19px',fontWeight:'bold' }}>직책</p>
                    <div style={{ width: '2vw' }}></div>
                    <div className="input-name" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30vw', height: '5.8vh', borderRadius: '27px', margin: '0.3vw' }}>
                     
                    <div className="input-name" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', width: '28vw', height: '5.8vh', fontSize: '13px' }}>
                    <input type='text' value={job} onChange={(e) => setJob(e.target.value)} placeholder={loggedInUser?.job} style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent' }} />
                            </div>
                        </div>
                    </div>

                    <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center',paddingRight: "1vw" }}>
                    <p style={{ color: "black", fontSize: '18.7px',fontWeight:'bold',}}>근무 시간</p>
                    <div style={{ width: '1.5vw' }}></div>
                    <div className="input-name" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30vw', height: '5.8vh', borderRadius: '27px', margin: '0.3vw' }}>
                      
                    <div className="input-name" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', width: '28vw', height: '5.8vh', fontSize: '13px' }}>
                    <input type='text' value={time} onChange={(e) => setTime(e.target.value)} placeholder={loggedInUser?.time} style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent' }} />
                            </div>
                        </div>
                    </div>
                    <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', position: 'relative' }}>
  <p style={{ color: "black", fontSize: '19px', fontWeight: 'bold' }}>나의 색깔</p>
  <div style={{ width: '1vw' }}></div>
  <div className="input-name" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '30vw',
    height: '5.8vh',
    borderRadius: '27px',
    margin: '1.1vw',
    position: 'relative'
  }}>
    <div className="input-name" style={{
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      width: '25vw',
      height: '5.8vh',
      fontSize: '13px'
    }}>
      {teamColor || '좌측 아이콘을 눌러 개인인 색을 선택해주세요'}
    </div>
    <div>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '2.6vw',
          height: '5vh',
          borderRadius: '100px',
          backgroundColor: teamColor,
          border: 'none',
        }}
        onClick={() => setColorPickerVisible(!colorPickerVisible)}
      />
    </div>

    {/* 🔥 여기! 색상 선택기 붙이기 */}
    {colorPickerVisible && (
      <div style={{
        position: 'absolute',
        top: '-15vh',
        right: '-25vw',
        zIndex: 100,
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
      }}>
        <HexColorPicker color={teamColor} onChange={setTeamColor} />
      </div>
    )}
  </div>
</div>

                    <div className='hang'>
                        <button className="login-gray" style={{ fontSize: "21px",paddingTop:"1.6vh" }} onClick={handleSave}>
                            수정하기
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MyPage;
