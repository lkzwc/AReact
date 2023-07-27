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

function createRoot(par) {
  return new AReactControl(par);
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

    if (index === 0) {
      workInProgress.child = newFiber;
    } else {
      previouSibling.sibling = newFiber;
    }
    previouSibling = newFiber;
  });

  // 返回下一个
  return getNextFiber(workInProgress);
}

class AReactControl {
  root = null;
  constructor(container) {
    this.root = {
      current: null,
      containerInfo: container,
    };
  }

  render(source) {
    // this.renderItem(this.container, source);

    this.root.current = {
      alternate: {
        stateNode: this.root.containerInfo,
        props: {
          childB: [source],
        },
      },
    };

    console.log("root", JSON.stringify(this.root?.current.stateNode));

    workInProgressRoot = this.root;
    workInProgress = workInProgressRoot.current.alternate;
    setTimeout(workloop);
  }
}

export default { createElement, createRoot };
