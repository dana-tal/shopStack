import store from "../store";
import { clearUser } from "../store/authSlice";

const DOMAIN = import.meta.env.VITE_APP_DOMAIN;

let redirecting = false; // prevents multiple redirects if many requests fail at once

const analize_error = (err) =>{
   
      console.log("analize error");
    if (err.response)  // Server responded with non-2xx status
      {
      console.log("Server responded with:",err.response.status,err.response.data);
      if (err.response?.status === 401) // not logged in ....
      {
         if (!redirecting) {
            redirecting = true;
            store.dispatch(clearUser());
            document.body.innerHTML = "Redirecting to login..."; // to prevent blank page
           window.location.href = `${window.location.origin}/auth/login`;

           // make redirecting great again ;-) (for next expired cookie)
            setTimeout(() => {
                redirecting = false;
              }, 1000); // 1 second, just in case
          }
           return {
              ok: false,
              message: "Session expired",
               data: err.response.data,
            };
      }
      else
      {
          return {   ok: false, message: err.response.data.message || "Action failed", data: err.response.data};
      }  
     
    } 
    else if (err.request) // Request was sent, but no response
    {
      console.log("No response received:", err.request);
      return {
        ok: false,
        message: "No response from server",
      };
    } 
    else   // Something else went wrong
    {
      console.log("Unexpected error:", err.message);
      return {
        ok: false,
        message: "Unexpected error: " + err.message,
      };
    }
}

function formatDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/*
function isMobile() {
  return window.matchMedia("(max-width: 600px)").matches;
}
  */

export {
    DOMAIN,
    analize_error,
    formatDate,
    /*isMobile */
}