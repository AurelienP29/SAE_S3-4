import axios from 'axios';

export const sendEmail = async (emailData) => {
    try{
        const endpoint = 'http://localhost:8080/api/email';
        const response = await axios.post('http://localhost:8080/api/email', emailData);
        return response.data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}