import * as React from 'react';
import { Pagination } from 'antd';

/**定义函数组件父传子 属性值类型。问号：该属性可有可无
接口的声明不要放在import语句的前面，可能会报错**/
type Key = string | number;

// 该类型的变量值只能是两种：null 和 ReactElement实例。通常情况下，函数组件返回ReactElement（JXS.Element）的值。
interface ReactElement<
  P = any,
  T extends string | React.JSXElementConstructor<any> =
    | string
    | React.JSXElementConstructor<any>
> {
  type: T;
  props: P;
  key: Key | null;
}
type ReactText = string | number;
type ReactChild = ReactElement | ReactText;
interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray;
interface ReactPortal extends ReactElement {
  key: Key | null;
  children: ReactNode;
}
type ReactNode =
  | ReactChild
  | ReactFragment
  | ReactPortal
  | boolean
  | null
  | undefined;

interface PropsFC {
  mode?: 'routine' | 'infinite'; // 枚举
  page?: number;
  limit?: number;
  loadMore?: boolean;
  children?: any;
  paginationProps?: any;
  // 方法 ------------
  queryPromise?: string | (() => any);
  noDataFn?: (res?: any[], list?: any[]) => boolean;
  noDataTips?: () => string | (() => any);
  noMoreDataTips?: ReactNode;
  renderList?: (list: ItemType[]) => ReactElement;
  renderItem?: (item?: {}, index?: number, list?: any[]) => any;
}

interface ItemType {
  key: number | string;
  value: string;
}

type QueryListParam = {
  curPage?: number;
  curLimit?: number;
};

// FC:function component 函数组件
const Demo: React.FC<PropsFC> = (props) => {
  // 格式 const [状态变量,修改状态的方法]=useState<变量的类型>(变量的值)
  const [list, setList] = React.useState<any[]>([]);
  const [page, setPage] = React.useState<number>(props.page || 1);
  const [limit, setLimit] = React.useState<number>(props.limit || 10);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isNoMoreData, setIsNoMoreData] = React.useState<boolean>(false);

  React.useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    setPage(page + 1);
    let data = await getListDataPromise();
    setList([...list, ...data]);
    if (!data.length) {
      setIsNoMoreData(true);
    }
  };

  const getListDataPromise = (queryListParam?: QueryListParam) => {
    setLoading(true);
    let api: string = '默认的api地址';

    if (props.queryPromise) {
      if (typeof props.queryPromise === 'function') {
        return props.queryPromise().finally(() => {
          setLoading(false);
        });
      }
      // api路径
      api = props.queryPromise;
    }

    // 如果没有传入queryPromise 走默认
    console.log(
      queryListParam?.curPage || page,
      queryListParam?.curLimit || limit
    );
    let data: Array<ItemType> = [];
    for (let i = 0; i < (queryListParam?.curLimit || limit); i++) {
      data.push({
        key: (queryListParam?.curPage || page) + '_' + i + 'key',
        value: (queryListParam?.curPage || page) + '_' + i + 'value',
      });
    }

    return new Promise((req, rej) => {
      console.log('api：' + api);
      setTimeout(() => {
        if (props.noDataFn ? props.noDataFn(data, list) : false) {
          req([]);
        } else {
          req(data);
        }
      }, 1000);
    }).finally(() => {
      setLoading(false);
    });
  };

  const renderNoMoreData = (): any => {
    if (typeof props.noMoreDataTips === 'function') {
      return props.noMoreDataTips();
    } else {
      return props.noMoreDataTips || '没有更多数据了';
    }
  };

  const paginationChange = async (page, limit) => {
    // console.log(page, limit);
    setPage(page);
    setLimit(limit);
    let data = await getListDataPromise({
      curPage: page,
      curLimit: limit,
    });
    setList(data);
  };

  return (
    <div>
      <div style={{ position: 'relative' }}>
        {props.renderList
          ? props.renderList(list)
          : list.length
          ? list.map((item, index) => {
              // 自定义renderItem
              if (props.renderItem) {
                return props.renderItem(item, index, list);
              }
              return <div key={item.key}>{item.value}</div>;
            })
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
      {/* 分页 */}
      {props.mode === 'routine' ? (
        <Pagination
          total={20}
          size="small"
          defaultCurrent={1}
          onChange={paginationChange}
          {...props.paginationProps}
        />
      ) : !isNoMoreData ? (
        <button onClick={getListData} disabled={loading}>
          加载更多
        </button>
      ) : (
        renderNoMoreData()
      )}
    </div>
  );
};

//定义props的默认值
Demo.defaultProps = {
  loadMore: true,
  mode: 'routine',
};
export default Demo;

// ------------------------------------------------------------------------------------------------
// 类组件
interface Props {
  color?: string;
}

//定义state中键的类型
interface States {
  msg: number;
  age: number;
}

/**声明一个类组件 Component<定义props的数据类型,定义state的数据类型>**/
export class Ulist extends React.Component<Props, States> {
  //定义props的默认值
  static defaultProps = {
    color: 'red',
  };
  state = {
    msg: 123,
    age: 10,
  };
  render() {
    let { color } = this.props;
    return (
      <div style={{ color }}>
        msg:{this.state.msg}, age: {this.state.age},
      </div>
    );
  }
}
