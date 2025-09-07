import axsios from 'axios';
const api = axsios.create({
    baseURL:'http://localhost:3000'
});
 export const googleAuth = async (code) => api.get(`/google?code=${code}`);