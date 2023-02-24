import * as React from "react";
import * as ReactDOM from "react-dom";
import * as o from "olca-ipc";
import { ConnectionPanel } from "./connection-panel";

type Client = o.IpcClient | o.RestClient;

interface State {
  client?: Client;
  error?: string;
}



const App = () => {
  const [state, setState] = React.useState<State>({});
  const [progress, setProgress] = React.useState<string | null>(null);

  const reset = () => {
    setState({});
    setProgress(null);
  }

  React.useEffect(() => {
    if (!state.client) {
      return;
    }
    const client = state.client!;
    setProgress("Connecting ...");
    (async () => {
      try {
        const systems = await client.getDescriptors(o.RefType.ProductSystem);
        const methods = await client.getDescriptors(o.RefType.ImpactMethod);
        if (!systems || systems.length === 0) {
          setState({ error: "Could not find any product systems" });
          return;
        }
        if (!methods || methods.length === 0) {
          setState({ error: "Could not find any product systems" });
          return;
        }
        setProgress(null);
      } catch (e) {
        setState({ error: `Connection failed: ${e}` });
      }
    })();

    console.log("client set!");
  }, [state.client]);

  if (state.error) {
    return <ErrorPanel message={state.error} onReset={reset} />;
  }
  if (progress) {
    return <ProgressPanel message={progress} />;
  }
  if (!state.client) {
    return <ConnectionPanel
      onConnected={(client) => setState({ ...state, client })} />;
  }
  return <ErrorPanel message="Unhandled state" onReset={reset} />;
};

const ErrorPanel = ({ message, onReset }:
  { message: string, onReset: () => void }) => {
  return <article>
    <h3 style={{ color: "#f06292" }}>Error</h3>
    <kbd>{message}</kbd>
    <div className="grid">
      <div />
      <div className="grid">
        <div />
        <a href="#" role="button" className="contrast outline"
          onClick={() => onReset()}>
          Try again
        </a>
        <div />
      </div>
    </div>
  </article>;
};

const ProgressPanel = ({ message }: { message: string }) => {
  return <article>
    <h3>{message}</h3>
    <progress />
  </article>;
};

async function main() {

  ReactDOM.render(<App />, document.getElementById("app"));

  /*
  const client = o.IpcClient.on(8080);
  const flowRefs = await client.getDescriptors(o.RefType.Flow);
  flowRefs.forEach(d => {
    console.log(d.id, d.flowType);
  })
  */
};

main();