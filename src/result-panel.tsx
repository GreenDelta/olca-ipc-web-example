import * as React from "react";
import * as o from "olca-ipc";
import * as protocol from "olca-ipc/types/src/protocol";

export const ResultPanel = ({ setup, result, onClose }: {
  setup: o.CalculationSetup, result: protocol.Result, onClose: () => void
}) => {

  const [impacts, setImpacts] = React.useState<o.ImpactValue[] | null>(null);

  React.useEffect(() => {
    (async () => {
      const ixs = await result.getTotalImpacts();
      ixs.sort((ix, iy) => {
        const nx = ix.impactCategory?.name || "";
        const ny = iy.impactCategory?.name || "";
        return nx.localeCompare(ny);
      });
      setImpacts(ixs);
    })();
  }, [result]);

  if (!impacts) {
    return <article aria-busy="true"></article>;
  }

  const items = impacts.map(i => <tr>
    <td>{i.impactCategory?.name}</td>
    <td>{i.amount?.toExponential(2)}</td>
    <td>{i.impactCategory?.refUnit}</td>
  </tr>);

  return <article>
    <h3>Results of: {setup.target?.name}</h3>
    <table>
      <thead>
        <tr>
          <th scope="col">Impact category</th>
          <th scope="col">Result</th>
          <th scope="col">Unit</th>
        </tr>
      </thead>
      <tbody>
        {items}
      </tbody>
    </table>
    <div className="grid">
      <div /><div /><div /><div /><div />
      <button className="contrast outline" onClick={onClose}>
        Close
      </button>
    </div>
  </article>
};
