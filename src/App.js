import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [userRole, setUserRole] = useState(null);

  return (
    <div>
      {/* ዩዘሩ ካልገባ ሎጊን ገጹን ያሳየዋል፣ ከገባ ደግሞ ዳሽቦርዱን ይከፍትለታል */}
      {!userRole ? (
        <Login setUserRole={setUserRole} />
      ) : (
        <Dashboard role={userRole} onLogout={() => setUserRole(null)} />
      )}
    </div>
  );
}

export default App;