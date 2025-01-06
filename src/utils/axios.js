import axios from 'axios';

const axiosServices = axios.create();

// Function to show session expired message and redirect
const handleSessionExpired = () => {
    // Clear local storage
    localStorage.clear();

    // Create and show the session expired message
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #f8d7da;
    color: #721c24;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    z-index: 9999;
  `;
    messageDiv.textContent = 'Your session has expired. Redirecting to login...';
    document.body.appendChild(messageDiv);

    // Redirect after a short delay
    setTimeout(() => {
        document.body.removeChild(messageDiv);
        window.location.href = '/ExergyHRM';
    }, 3000);  // 3 seconds delay
};

// Interceptor for http
axiosServices.interceptors.response.use(
    (response) => {
        // Log successful response
        // console.log('API Response:', {
        //     url: response.config.url,
        //     method: response.config.method,
        //     status: response.status,
        //     data: response.data
        // });
        return response;
    },
    (error) => {
        // Log error response
        // console.error('API Error:', {
        //     url: error.config.url,
        //     method: error.config.method,
        //     status: error.response ? error.response.status : 'Unknown',
        //     data: error.response ? error.response.data : 'No response data'
        // });

        // Check for "Access Denied" message
        if (error.response &&
            error.response.data &&
            error.response.data.USER_MESSAGE === 'Access Denied..!') {
           // handleSessionExpired();
        }

        return Promise.reject((error.response && error.response.data) || 'Wrong Services');
    }
);

export default axiosServices;