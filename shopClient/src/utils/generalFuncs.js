
const DOMAIN = import.meta.env.VITE_APP_DOMAIN;

const analize_error = (err) =>{
      console.log("analize error");
    if (err.response)  // Server responded with non-2xx status
      {
      console.log("Server responded with:", err.response.data);
      return {
        ok: false,
        message: err.response.data.message || "Action failed",
        data: err.response.data,
      };
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