function createElement(type, props, ...child) {
  return {
    type,
    props: {
      ...props,
      children: child.props?.map((item) =>
        typeof item === "string"
          ? {
              type: "HostText",
              props: {
                nodeValue: item,
                children: [],
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

class AReactControl {
  constructor(container) {
    this.container = container;
  }

  render(source) {
    this.renderItem(this.container, source);
  }

  renderItem(parent, source) {
    const target = document.createElement(source.type);

    //设置属性
    Object.keys(source.props ?? Object)
      .filter((item) => item !== "children")
      .map((key) => (target[key] = source.props[key]));

    //处理children
    source.props?.children?.map((item) => this.renderItem(target, item));

    parent.appendChild(target);
  }
}

export default { createElement, createRoot };
