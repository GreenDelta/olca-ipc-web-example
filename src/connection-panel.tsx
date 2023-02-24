import * as React from "react";
import * as o from "olca-ipc";

type Client = o.IpcClient | o.RestClient;

export const ConnectionPanel = (
  props: { onConnected: (client: Client) => void }) => {

  type Protocol = "JSON-RPC" | "REST";

  const [url, setUrl] = React.useState("http://localhost:8080");
  const [protocol, setProtocol] = React.useState<Protocol>("JSON-RPC");
  const protocols: Protocol[] = ["JSON-RPC", "REST"];

  const onConnect = () => {
    console.log(`connect: ${protocol} :: ${url}`);
    const client = protocol === "JSON-RPC"
      ? o.IpcClient.on(url)
      : o.RestClient.on(url);
    props.onConnected(client);
  };

  return <article>
    <h3>Connect to an openLCA server</h3>
    <p>
      This will try to connect to an openLCA IPC server at the given
      URL using the selected protocol. For example, you can start
      an IPC server from the openLCA user interface under <strong>
        Tools &gt; Developer tools &gt; IPC Server</strong> and
      connect to it with the default settings. In order to run a
      calculation example, the connected database of that server
      needs to contain at least one product system and impact
      assessment method.
    </p>
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
