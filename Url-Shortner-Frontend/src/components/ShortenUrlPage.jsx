
// import React, { useEffect } from 'react'
// import { useParams } from 'react-router-dom'

// const ShortenUrlPage = () => {
//     const { url } = useParams();

//     useEffect(() => {
//         if (url) {
//             window.location.href = import.meta.env.VITE_BACKEND_URL + `/${url}`;
//         }
//     }, [url]);
//   return <p>Redirecting...</p>;
// }

// export default ShortenUrlPage

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ShortenUrlPage = () => {
  const { url } = useParams();

  useEffect(() => {
    if (url) {
      // Remove trailing slash from backend URL
      const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");
      // Remove leading slash from short code
      const shortCode = url.replace(/^\/+/, "");

      window.location.href = `${backendUrl}/${shortCode}`;
    }
  }, [url]);

  return <p>Redirecting...</p>;
};

export default ShortenUrlPage;
