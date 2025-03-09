import './App.css';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';  
import { useNavigate } from 'react-router-dom';
import { HexColorPicker } from "react-colorful";  // npm install react-colorful 필요

const users = [
    { id: "1", name: "김수진", email: "user@naver.com", job: "프론트엔드", time: "10:00~18:00", color: "#FFC0CB", image: "https://via.placeholder.com/100" }
];

const userId = "1"; // 현재 로그인된 사용자 ID
const loggedInUser = users.find(user => user.id === userId);

function MyPage() {
    let title = 'MyPage';
    const navigate = useNavigate();

    // 사용자 정보 상태
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [job, setJob] = useState("");
    const [time, setTime] = useState("");
    const [teamColor, setTeamColor] = useState(loggedInUser?.color || "#ffffff");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(loggedInUser?.image || "");
    const [colorPickerVisible, setColorPickerVisible] = useState(false);  // 색상 선택기 표시 여부

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // 미리보기 URL 생성
        }
    };

    const handleSave = () => {
        Swal.fire({
            icon: "success",
            title: "수정 완료!",
            text: "정보가 저장되었습니다.",
        });
    };

    return (
        <div className='white-line'>
            <p 
                style={{ color: 'black', fontSize: 53, fontWeight: 'bold', marginBottom: '16px', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.4)' }} 
                onClick={() => navigate('/')}
            >
                {title}
            </p>
            <div className='blue-box' style={{ height: "73vh" }}>
                <div className='gray-box' style={{ height: "60vh" }}>
                    
                    {/* 프로필 사진 미리보기 */}
                    <div className='hang' style={{ paddingLeft: "1vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {preview && (
                            <img src={preview} alt="프로필 사진" style={{ width: "100px", height: "100px", borderRadius: "50%", marginBottom: "10px" }} />
                        )}
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>

         {/* 이름 */}
         <div className="input-name" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30vw', height: '5.8vh', borderRadius: '27px', margin: '0.3vw' }}>
                        <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center' }}>
                            <div style={{ color: 'black' }}>이름 :</div>
                            <div style={{ width: '0.4vw' }}></div>
                            <div className="input-name" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', width: '18.5vw', height: '5.8vh', fontSize: '13px' }}>
                                <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder={loggedInUser?.name} style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent' }} />
                            </div>
                        </div>
                    </div>

                    {/* 이메일 */}
                    <div className="input-name" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30vw', height: '5.8vh', borderRadius: '27px', margin: '0.3vw' }}>
                        <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center' }}>
                            <div style={{ color: 'black' }}>이메일 :</div>
                            <div style={{ width: '0.4vw' }}></div>
                            <div className="input-name" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', width: '18.5vw', height: '5.8vh', fontSize: '13px' }}>
                                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder={loggedInUser?.email} style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent' }} />
                            </div>
                        </div>
                    </div>

                    {/* 직책 */}
                    <div className="input-name" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30vw', height: '5.8vh', borderRadius: '27px', margin: '0.3vw' }}>
                        <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center' }}>
                            <div style={{ color: 'black' }}>직책 :</div>
                            <div style={{ width: '0.4vw' }}></div>
                            <div className="input-name" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', width: '18.5vw', height: '5.8vh', fontSize: '13px' }}>
                                <input type='text' value={job} onChange={(e) => setJob(e.target.value)} placeholder={loggedInUser?.job} style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent' }} />
                            </div>
                        </div>
                    </div>

                    {/* 근무 시간 */}
                    <div className="input-name" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30vw', height: '5.8vh', borderRadius: '27px', margin: '0.3vw' }}>
                        <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center' }}>
                            <div style={{ color: 'black' }}>근무 시간 :</div>
                            <div style={{ width: '0.4vw' }}></div>
                            <div className="input-name" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', width: '18.5vw', height: '5.8vh', fontSize: '13px' }}>
                                <input type='text' value={time} onChange={(e) => setTime(e.target.value)} placeholder={loggedInUser?.time} style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent' }} />
                            </div>
                        </div>
                    </div>
                    <div className="input-name" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '30vw', height: '5.8vh', borderRadius: '27px', margin: '0.3vw' }}>
                        <div className="hang" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center' }}>
                            <div style={{ color: 'black' }}>Team color :</div>
                            <div style={{ width: '0.4vw' }}></div>
                            <div className="input-name" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', width: '18.5vw', height: '5.8vh', fontSize: '13px' }}>
                                {teamColor || '좌측 아이콘을 눌러 팀 색을 선택해주세요'}
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
                        </div>
                    </div>

                    {/* 색상 선택기 (HexColorPicker) */}
                    {colorPickerVisible && (
                        <div style={{ position: 'absolute', top: '18vh', right: '15vw', zIndex: 10 }}>
                            <HexColorPicker color={teamColor} onChange={setTeamColor} />
                        </div>
                    )}
                    {/* 수정 버튼 */}
                    <div className='hang'>
                        <button className="login-gray" style={{ fontSize: "23px", }} onClick={handleSave}>
                            수정하기
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MyPage;
