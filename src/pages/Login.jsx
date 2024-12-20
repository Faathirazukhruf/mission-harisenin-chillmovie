import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { auth, provider } from './firebaseConfig'; // Import Firebase config
import { signInWithPopup } from 'firebase/auth'; // Import signInWithPopup
import './Login.css'; 
import logo from "../assets/Logo.png"; 
import background from "../assets/masuk.jpeg";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL; 

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!username || !password) {
      setError('Semua field harus diisi');
      return;
    }
    
    try {
      const response = await axios.get(`${API_URL}/users`); 
      const users = response.data;

      const user = users.find(user => user.username === username && user.password === password);
      
      if (user) {
        console.log('Login berhasil:', user);
        
        sessionStorage.setItem('username', user.username); // Simpan username
        sessionStorage.setItem('token', user.token); // Simpan token

        navigate('/beranda'); 
      } else {
        setError('Login gagal. Periksa username dan kata sandi Anda.');
      }
    } catch (error) {
      console.error('Login gagal:', error);
      setError('Gagal login. Coba lagi nanti.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Kirim data pengguna ke API 
      const response = await axios.post(`${API_URL}/users`, {
        username: user.displayName,
        email: user.email,
      });

      console.log("Login dengan Google berhasil:", response.data);
      sessionStorage.setItem('username', response.data.username);
      sessionStorage.setItem('token', response.data.token); // Simpan token
      navigate('/beranda');
    } catch (error) {
      console.error("Gagal masuk dengan Google:", error);
      setError("Gagal masuk dengan Google. Coba lagi nanti.");
    }
  };

  return (
    <>
      <div className="cover" style={{ backgroundImage: `url(${background})` }}></div>
      <div className="container"></div>
      <div className="login-container">
        <div className="login-box">
          <div className="logo-container">
            <img src={logo} alt="Chill" className="centered-logo" />
          </div>
          <h2>Masuk</h2>
          <p>Selamat datang kembali!</p>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="login-button">Masuk</button>
          </form>
          <div className="divider">
            <span>Atau</span>
          </div>
          <p>lupa kata sandi?</p>
          <a href="/daftar" className="daftardisini">Belum punya akun? daftar disini</a>
          <button type="button" className="google-login" onClick={handleGoogleSignIn}>
            <img src="https://www.google.com/images/branding/product/ico/googleg_lodp.ico" alt="Google" />
            Masuk dengan Google
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;