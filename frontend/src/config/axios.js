import axios from "axios";

// Set the base URL for all Axios requests
axios.defaults.baseURL = "http://localhost:8080";

// Add default headers
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add a request interceptor to include the token in headers
axios.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");

    // If the request is to the login endpoint, do not check for the token
    if (config.url === "/login") {
      delete config.headers["Authorization"];
      return config;
    }

    // If the request is to the signup endpoint, do not include the token
    if (config.url === "/signup") {
      delete config.headers["Authorization"];
      return config;
    }

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
axios.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Handle 401 Unauthorized errors (e.g., token expiration)
      if (status === 401) {
        console.error("Unauthorized: Token may have expired.");

        // Remove the token from localStorage
        localStorage.removeItem("token");

        // Redirect the user to the login page
        window.location.href = "/login";
      }

      // Handle other status codes if needed
      if (status === 403) {
        console.error(
          "Forbidden: You do not have permission to access this resource."
        );
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
