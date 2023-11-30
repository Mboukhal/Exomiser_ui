import { ReactNode } from "react";
import "./Main.css";

interface ParentComponentProps {
  children: ReactNode;
}

const Main: React.FC<ParentComponentProps> = (props) => {
  // if (props.children) console.log(props.children[0].props.children);

  return <div>{props.children}</div>;
};

export default Main;
