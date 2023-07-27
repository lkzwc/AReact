function createElement(type, props, ...child) {
  return {
    type,
    props: {
      ...props,
      childB: child.map((item) =>
        typeof item === "string"
          ? {
              type: "HostText",
              props: {
                nodeValue: item,
                childB: [],
              },
            }
          : item
      ),
    },
  };
}

let workInProgress = null; //当前渲染的Fiber节点
let workInProgressRoot = null;

function workloop() {
  while (workInProgress) {
    workInProgress = profromUnitOfWork(workInProgress);
  }
}

function getNextFiber(fiber) {
  if (fiber.childB) {
    return fiber.childB;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    } else {
      nextFiber = nextFiber.return;
    }
  }
  return null;
}

// workInProgress === document.createElement("div");
function profromUnitOfWork(workInProgress) {
  // 处理当前fiber 1.创建dom  2.绑定属性  3.children
  if (workInProgress.stateNode) {
    workInProgress.stateNode =
      workInProgress.type === "HostText"
        ? document.createTextNode()
        : document.createElement(workInProgress.type);

    //设置属性
    Object.keys(workInProgress.props ?? Object)
      .filter((item) => item !== "children")
      .map(
        (key) => (workInProgress.stateNode[key] = workInProgress.props[key])
      );
  }

  //插入fiber节点
  console.log("workInProgress.return", workInProgress.return);
  if (workInProgress.return) {
    workInProgress.return.stateNode?.appendChild(workInProgress.stateNode);
  }

  //处理children
  let previouSibling = null;
  workInProgress.props?.childB?.map((item, index) => {
    const newFiber = {
      type: item.type,
      stateNode: null,
      props: item.props,
      return: workInProgress,
    };

    //创建节点 如果是第一个直接插入child 如果是其他插入child的sibling
    if (index === 0) {
      workInProgress.childB = newFiber;
    } else {
      previouSibling.sibling = newFiber;
    }
    previouSibling = newFiber;
  });

  // 返回下一个
  return getNextFiber(workInProgress);
}

function createRoot(par) {
  return new AReactControl(par);
}

class AReactControl {
  root = null;
  constructor(container) {
    // this.root = {
    //   current: null,
    //   containerInfo: container,
    // };
    this.container = container;
  }

  render(source) {
    // this.renderItem(this.container, source);

    // this.root.current = {
    //   alternate: {
    //     stateNode: this.root.containerInfo, // document.createElement("div");
    //     props: {
    //       childB: [source], //ele
    //     },
    //   },
    // };

    console.log("root", JSON.stringify(this.root?.current.stateNode));

    workInProgressRoot = this.root;
    // workInProgress = workInProgressRoot.current.alternate;
    workInProgress = this.container;
    setTimeout(workloop, 1000);
  }
}

export default { createElement, createRoot };
