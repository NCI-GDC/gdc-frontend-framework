// eslint-disable-next-line @typescript-eslint/no-unused-vars
/*
import { PureComponent, ReactNode } from "react";
import type { Persistor } from "redux-persist";

type Props = {
  onBeforeLift?: () => void;
  children: ReactNode | ((state: boolean) => ReactNode);
  loading: ReactNode;
  persistor: Persistor;
  name: string;
};

type State = {
  bootstrapped: boolean;
};

export class AppPersistGate extends PureComponent<Props, State> {
  static defaultProps = {
    children: null,
    loading: null,
  };

  state = {
    bootstrapped: false,
  };
  _unsubscribe?: () => void;

  componentDidMount(): void {
    console.log("mounting");
    this._unsubscribe = this.props.persistor.subscribe(
      this.handlePersistorState,
    );
    this.handlePersistorState();
  }

  handlePersistorState = (): void => {
    const { persistor } = this.props;
    const { registry, bootstrapped } = persistor.getState();
    console.log("bootstrapped", bootstrapped, " ", registry, " ", this.props.name);
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift()).finally(() =>
          this.setState({ bootstrapped: true }),
        );
      } else {
        this.setState({ bootstrapped: true });
      }
      this._unsubscribe && this._unsubscribe();
    }
  };

  componentWillUnmount(): void {
    console.log("unmounting", this.props.name);
    this._unsubscribe && this._unsubscribe();
  }

  render(): ReactNode {
    if (process.env.NODE_ENV !== "production") {
      if (typeof this.props.children === "function" && this.props.loading)
        console.error(
          "redux-persist: PersistGate expects either a function child or loading prop, but not both. The loading prop will be ignored.",
        );
    }
    if (typeof this.props.children === "function") {
      return this.props.children(this.state.bootstrapped);
    }

    return this.state.bootstrapped ? this.props.children : this.props.loading;
  }
}--- */

import { useState, ReactNode, PropsWithChildren, useEffect } from "react";
import type { Persistor } from "redux-persist";

interface Props {
  loading: ReactNode;
  persistor: Persistor;
  name: string;
}
export const AppPersistGate = ({
  children,
  persistor,
  loading,
  name,
}: PropsWithChildren<Props>) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    persistor.dispatch({ key: name, type: "persist/REHYDRATE" });
    setReady(true);
    // console.log("mount", name);
    // persistor.dispatch({key: name, type: "persist/REHYDRATE"});
    // persistor.subscribe(() => {
    //
    //     console.log("done", bootstrapped)
    //     if (bootstrapped) {
    //         console.log("setting ready")
    //         setReady(true);
    //     }
    // })
    return () => {
      console.log("unmount", name);
      persistor.pause();
    };
  });

  return ready
    ? (children as unknown as JSX.Element | null)
    : (loading as unknown as JSX.Element | null);
};
