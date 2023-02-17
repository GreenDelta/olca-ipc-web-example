import * as o from "olca-ipc";

async function main() {
  const client = o.IpcClient.on(8080);
  const flowRefs = await client.getDescriptors(o.RefType.Flow);
  flowRefs.forEach(d => {
    console.log(d.id, d.flowType);
  })
};

main();