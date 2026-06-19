import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Интернет-магазин</h1>
        <p style={{ marginBottom: 24 }}>Войдите, чтобы продолжить</p>
        <GoogleLogin
          onSuccess={async (res) => {
            await login(res.credential!);
            navigate('/');
          }}
          onError={() => alert('Ошибка входа')}
        />
      </div>
    </div>
  );
}
