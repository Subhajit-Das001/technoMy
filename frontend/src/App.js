import React, { useEffect } from 'react';
import AppRoutes from './AppRoutes';
import loadScript from './components/loadscript';

function App() {
//   const handleScript = async () => {
//     if (document.getElementById('lipy-webchat')) return
//     await loadScript("https://cdn.lipy.ai/packages/webchat.js")
//     window.LipyWebchat({
//         apiKey: 'BMfMEn2TjeYQuyhwhyBRFbsDyk66dp',
//         orgId: 'm1Vbt6b1nXjKWiJP',
//     })
// }

// const handleScript = async () => {
//   if (document.getElementById('lipy-webchat')) return;
//   try {
//       await loadScript("https://cdn.lipy.ai/packages/webchat.js");
//       window.LipyWebchat({
//           apiKey: 'BMfMEn2TjeYQuyhwhyBRFbsDyk66dp',
//           orgId: 'm1Vbt6b1nXjKWiJP',
//       });
//   } catch (error) {
//       console.error("Error loading Lipy script:", error);
//   }
// };

//   useEffect(()=>{
//    const timer=setTimeout(() => {
//     handleScript()
//    }, 1000);
//   return()=>{
//     clearTimeout(timer)
//   }
//   },[])

  return (
    <div className="App">
      <div className="app-container">
        <AppRoutes/>
        
      </div>
    </div>
  );
}

export default App;