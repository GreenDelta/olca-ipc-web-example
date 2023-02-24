import * as React from "react";
import * as ReactDOM from "react-dom";
import * as o from "olca-ipc";
import * as protocol from "olca-ipc/types/src/protocol";
import { ConnectionPanel } from "./connection-panel";
import { SetupPanel } from "./setup-panel";
import { ResultPanel } from "./result-panel";

interface State {
  client?: protocol.Client;
  error?: string;
  setup?: o.CalculationSetup;
  result?: protocol.Result;
}

const App = () => {
  const [state, setState] = React.useState<State>({});
  const [progress, setProgress] = React.useState<string | null>(null);
  const [dataRefs, setDataRefs] = React.useState<{
    systems: o.Ref[];
    methods: o.Ref[];
  } | null>(null);

  const reset = () => {
    if (state.result) {
      state.result.dispose();
    }
    setState({});
    setProgress(null);
    setDataRefs(null);
  }

  const fail = (error: string) => {
    reset();
    setState({ error });
  };

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
          fail("Could not find any product systems");
          return;
        }
        if (!methods || methods.length === 0) {
          fail("Could not find any LCIA method");
          return;
        }
        setDataRefs({ systems, methods });
        setProgress(null);
      } catch (e) {
        fail(`Connection failed: ${e}`);
      }
    })();
  }, [state.client]);

  const calculate = async (setup: o.CalculationSetup) => {
    setProgress("Calculating ...")
    const result = await state.client?.calculate(setup);
    if (!result) {
      fail("calculation failed: no result retrieved");
      return;
    }
    const s = await result.untilReady();
    if (s.error) {
      fail(s.error);
      return;
    }
    setProgress(null);
    setState({ ...state, setup, result });
  };

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
  if (!state.result && dataRefs) {
    return <SetupPanel {...dataRefs}
      onCalculate={(setup) => { calculate(setup); }} />
  }
  if (state.setup && state.result) {
    return <ResultPanel
      setup={state.setup}
      result={state.result}
      onClose={reset} />
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

function main() {
  ReactDOM.render(<App />, document.getElementById("app"));
};
main();
