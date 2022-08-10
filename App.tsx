import * as React from 'react';
import Demo, { Ulist } from './demo';
import './style.css';

const App: React.FC = () => {
  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
      <Ulist />
      <Demo />
    </div>
  );
};

export default App;
