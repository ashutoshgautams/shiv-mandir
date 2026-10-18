import { SEASONS, hiTime } from "@/lib/samay";

export function SamayTable() {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {SEASONS.map((s) => (
        <div key={s.id} className="bg-card rounded-2xl border border-line overflow-hidden">
          <div className="px-5 py-3.5 bg-saffron-soft border-b border-line flex items-baseline justify-between gap-3">
            <h3 className="text-[1.35rem]">{s.title}</h3>
            <span className="text-ink-soft text-[0.95rem]">{s.range}</span>
          </div>
          <table className="w-full text-[1.05rem]">
            <tbody>
              {s.rows.map((r) => (
                <tr key={r.label} className="border-b border-line last:border-0">
                  <th scope="row" className="text-left font-normal px-5 py-3">
                    {r.aarti && <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-saffron mr-2.5 align-middle" />}
                    {r.label}
                  </th>
                  <td className="text-right font-semibold px-5 py-3 tabular-nums whitespace-nowrap">
                    {hiTime(r.time)}
                    {r.until && <> से {hiTime(r.until)}</>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
