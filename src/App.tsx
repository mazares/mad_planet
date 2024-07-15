import "./App.css";
import Canvas from "./components/canvas/Canvas";
import Message from "./components/message/Message";

export default function App() {
  return (
    <div className="app">
      <Canvas />
      <Message />
    </div>
  );
}
