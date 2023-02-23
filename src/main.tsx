import * as React from "react";
import * as ReactDOM from "react-dom";
import * as o from "olca-ipc";

interface State {
  client: o.IpcClient | o.RestClient;
}

async function main() {

  ReactDOM.render(<ConnectionPanel />, document.getElementById("app"));

  /*
  const client = o.IpcClient.on(8080);
  const flowRefs = await client.getDescriptors(o.RefType.Flow);
  flowRefs.forEach(d => {
    console.log(d.id, d.flowType);
  })
  */
};

const ConnectionPanel = () => {

  type Protocol = "JSON-RPC" | "REST";

  const [url, setUrl] = React.useState("http://localhost:8080");
  const [protocol, setProtocol] = React.useState<Protocol>("JSON-RPC");
  const protocols: Protocol[] = ["JSON-RPC", "REST"];

  const onConnect = () => {
    console.log(`connect: ${protocol} :: ${url}`);
    const client = protocol === "JSON-RPC"
      ? o.IpcClient.on(url)
      : o.RestClient.on(url);
  };

  return <article>
    <h3>Connect to an openLCA server</h3>
    <form>
      <div className="grid">
        <label htmlFor="url">
          URL
          <input type="url" id="url" value={url}
            onChange={(e) => setUrl(e.target.value)}>
          </input>
        </label>
        <label htmlFor="protocol">
          Protocol
          <select value={protocol}
            onChange={(e) => setProtocol(e.target.value as Protocol)}>
            {protocols.map(p => <option>{p}</option>)}
          </select>
        </label>
      </div>
      <div className="grid">
        <div />
        <div className="grid">
          <div />
          <div />
          <a href="#" role="button" className="contrast outline"
            onClick={() => onConnect()}>
            Connect
          </a>
        </div>
      </div>
    </form>
  </article>
};


main();