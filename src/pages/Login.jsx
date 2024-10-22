import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './Login.css'; 
import logo from "../assets/Logo.png"; 
import background from "../assets/masuk.jpeg";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Pastikan API_URL hanya berisi bagian dasar dari URL MockAPI
  const API_URL = import.meta.env.VITE_API_URL; // Contoh: 'https://67163d3d33bc2bfe40bd0b1a.mockapi.io'

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validasi sederhana
    if (!username || !password) {
      setError('Semua field harus diisi');
      return;
    }
    
    // Kirim permintaan untuk mendapatkan daftar pengguna
    try {
      const response = await axios.get(`${API_URL}/users`); // Pastikan ini benar
      const users = response.data;

      // Cek apakah username dan password cocok
      const user = users.find(user => user.username === username && user.password === password);
      
      if (user) {
        console.log('Login berhasil:', user);
        navigate('/beranda'); // Arahkan ke halaman Beranda
      } else {
        setError('Login gagal. Periksa username dan kata sandi Anda.');
      }
    } catch (error) {
      console.error('Login gagal:', error);
      setError('Gagal login. Coba lagi nanti.');
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
          <a href="https://accounts.google.com/signin" className="google-login">
            <img src="https://www.google.com/images/branding/product/ico/googleg_lodp.ico" alt="Google" />
            Masuk dengan Google
          </a>
        </div>
      </div>
    </>
  );
}

export default Login;