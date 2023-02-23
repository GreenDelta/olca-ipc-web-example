import * as React from "react";
import * as ReactDOM from "react-dom";
import * as o from "olca-ipc";

async function main() {

  ReactDOM.render(<h1>Works</h1>, document.getElementById("app"));

  /*
  const client = o.IpcClient.on(8080);
  const flowRefs = await client.getDescriptors(o.RefType.Flow);
  flowRefs.forEach(d => {
    console.log(d.id, d.flowType);
  })
  */
};

main();