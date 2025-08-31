import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
    
    const role = localStorage.getItem('userRole');

    return { role };
};