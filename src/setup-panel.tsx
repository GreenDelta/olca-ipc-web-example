import * as React from "react";
import * as o from "olca-ipc";

export const SetupPanel = (props: {
  systems: o.Ref[],
  methods: o.Ref[],
  onCalculate: (setup: o.CalculationSetup) => void
}) => {

  const systems = sort(props.systems);
  const methods = sort(props.methods);
  const [system, setSystem] = React.useState<o.Ref | null>(null);
  const [method, setMethod] = React.useState<o.Ref | null>(null);

  return <article>
    <h3>Calculation setup</h3>
    <form>
      <label htmlFor="system">
        Product system
        <select id="system" value={system?.id || ""}
          onChange={(e) => setSystem(select(e.target.value, systems))}>
          <option value=""></option>
          {systems.map(s => <option value={s.id || ""}>{s.name}</option>)}
        </select>
      </label>
      <label htmlFor="method">
        Impact assessment method
        <select id="method" value={method?.id || ""}
          onChange={(e) => setMethod(select(e.target.value, methods))}>
          <option value=""></option>
          {methods.map(m => <option value={m.id || ""}>{m.name}</option>)}
        </select>
      </label>
      <div className="grid">
        <div />
        <div className="grid">
          <div />
          <div />
          <button className="contrast outline" disabled={!system || !method}
            onClick={() => props.onCalculate(o.CalculationSetup.of({
              target: system,
              impactMethod: method,
            }))}>
            Calculate
          </button>
        </div>
      </div>
    </form>
  </article>

};

function sort(refs: o.Ref[]): o.Ref[] {
  if (!refs || refs.length === 0) {
    return [];
  }
  const handled: Record<string, boolean> = {};
  const nodups: o.Ref[] = [];
  for (const ref of refs) {
    if (!ref.name) {
      continue;
    }
    const key = ref.name.trim();
    if (handled[key]) {
      continue;
    }
    handled[key] = true;
    nodups.push(ref);
  }
  nodups.sort((r1, r2) => r1.name?.localeCompare(r2.name || "") || 0);
  return nodups;
}

function select(id: string, refs: o.Ref[]): o.Ref | null {
  if (!id) {
    return null;
  }
  for (const ref of refs) {
    if (!ref.id) {
      continue;
    }
    if (id == ref.id) {
      return ref;
    }
  }
  return null;
}
