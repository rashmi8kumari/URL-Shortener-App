import { removeToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav>
      <a href="/">Home</a> | <a href="/stats">Stats</a> | <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
