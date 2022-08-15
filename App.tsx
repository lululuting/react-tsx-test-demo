import * as React from 'react';
import Demo, { Ulist } from './demo';
import './style.css';

const App: React.FC = () => {
  const renderNoMoreDataTips = () => {
    return <div style={{ color: 'blue' }}>就是没有了</div>;
  };
  const renderItem = (item) => {
    return (
      <div style={{ borderBottom: '1px solid #333', padding: 10 }}>
        <span style={{ color: 'block' }}>{item.key}</span>
        ---
        <span style={{ color: 'red' }}>{item.value}</span>;
      </div>
    );
  };

  return (
    <div>
      <h1>通用分页组件</h1>
      {/* <Ulist /> */}

      <Demo
        noMoreDataTips={renderNoMoreDataTips}
        renderItem={renderItem}
        mode={'paging'}
        limit={9}
        // noDataFn={(res) => res.length >= 20}
      />
    </div>
  );
};

export default App;
