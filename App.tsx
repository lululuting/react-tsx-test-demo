import * as React from 'react';
import { Divider, List, Typography } from 'antd';
import 'antd/dist/antd.css';
import Demo, { Ulist } from './demo';
import './style.css';

interface ItemType {
  key: number | string;
  value: string;
}

const App: React.FC = () => {
  const renderNoMoreDataTips = () => {
    return <div style={{ color: 'blue' }}>就是没有了</div>;
  };

  const renderList = (data: ItemType[]) => {
    return (
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<a href="https://ant.design">{item.key}</a>}
              description={item.value}
            />
          </List.Item>
        )}
      />
    );
  };

  const renderItem = (item: ItemType) => {
    return (
      <div>
        <List.Item>{item.value}</List.Item>
      </div>
    );
  };

  return (
    <div>
      <h1>通用分页组件</h1>
      {/* <Ulist /> */}

      <Demo
        noMoreDataTips={renderNoMoreDataTips}
        // renderList={renderList}
        renderItem={renderItem}
        mode="routine"
        limit={9}
        paginationProps={{
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </div>
  );
};

export default App;
