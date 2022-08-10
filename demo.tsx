import React, { useState, useEffect, Component } from 'react';
// 函数组件

/**定义函数组件父传子 属性值类型。问号：该属性可有可无
接口的声明不要放在import语句的前面，可能会报错**/
interface PropsFC {
  queryPromise?: any,
  loading?: boolean,
  page?: number,
  limit?:  number,
  noDataFn?: any,
  noDataTips?: any,
  loadMore?: boolean,
  noMoreDataTips?: any,
  children?: any,
}
// FC:function component 函数组件 
const Demo:React.FC<PropsFC> = (props) => {
  // 格式 const [状态变量,修改状态的方法]=useState<变量的类型>(变量的值)
  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(props.page || 1);
  const [limit, setLimit] = useState<number>(props.limit || 10);
  const [loading, setLoading] = useState<boolean>(props.loading || false);
  const [isNoMoreData, setIsNoMoreData] = useState<boolean>(false);

  useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    setPage((prev) => prev + 1);
    let data = await getListDataPromise();
    setList([...list, ...data]);
    if (!data.length) {
      setIsNoMoreData(true);
    }
  };

  const getListDataPromise = async () => {
    setLoading(true);

    if (props.queryPromise) {
      return props.queryPromise().finally(() => {
        setLoading(false);
      });
    }

    let data: any[]  = [];
    for (let i = 0; i < limit; i++) {
      data.push({
        key: page + '_' + i + 'key',
        value: page + '_' + i + 'value',
      });
    }

    return new Promise((req, rej) => {
      setTimeout(() => {
        if (props.noDataFn ? props.noDataFn() : list.length >= 40) {
          req([]);
        } else {
          req(data);
        }
      }, 1000);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div>
      <div style={{ position: 'relative' }}>
        {list.length
          ? list.map((item) => <div key={item.key}>{item.value}</div>)
          : props.noDataTips || '没有数据'}
        {props.children}

        {loading ? (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              bottom: '0',
              height: '500px',
              backgroundColor: 'rgb(0 0 0 / 22%)',
              color: '#fff',
            }}
          >
            loading
          </div>
        ) : null}
      </div>

      {props.loadMore ? (
        !isNoMoreData ? (
          <button onClick={getListData} disabled={loading}>
            加载更多
          </button>
        ) : props.noMoreDataTips ? (
          props.noMoreDataTips
        ) : (
          '没有更多数据了'
        )
      ) : null}
    </div>
  );
}

//定义props的默认值
Demo.defaultProps={
  loadMore: true
}


// ------------------------------------------------------------------------------------------------
// 类组件
interface Props {
  color?: string,
}

//定义state中键的类型
interface States{
  msg: number,
  age: number
}
/**声明一个类组件 Component<定义props的数据类型,定义state的数据类型>**/
export class Ulist extends Component<Props, States> {
  //定义props的默认值
  static defaultProps = {
    color: 'red'
  }
  state = {
    msg: 123,
    age: 10
  }
  render() {
    let { color } =this.props
    return (
      <div style={{color}}>
        msg:{this.state.msg}, age: {this.state.age},
      </div>
    )
  }
}


export default Demo;