import type { UserProfileFlat } from "../../../types";

function formatValue(key: string, value: unknown): string {
  if (value == null) return "";
  if (typeof value === "object") {
    if (key === "address") {
      const a = value as Record<string, string>;
      return [a.street, a.city, a.state, a.zipCode, a.country].filter(Boolean).join(", ");
    }
    return JSON.stringify(value, null, 1);
  }
  return String(value);
}

export default function DataTable({
    profiles,
    allKeys}:{profiles:UserProfileFlat[];
        allKeys:string[]}) {
            return (
                <div className="overflow-x-auto bg-white/20 rounded-lg">
                  <table className="min-w-full border-separate border-spacing-0">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 sticky left-0 bg-gray-100">
                          Email
                        </th>
                        {allKeys.map((key) => (
                          <th key={key} className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[150px]">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.map((profile)=>(
                        <tr key={profile.id} className="border-b border-gray-200 hover:bg-white/60">
                          <td className="px-4 py-3 font-medium text-gray-800 sticky left-0 bg-white/100 w-[120px] min-w-[100px] max-w-[200px]">
                            <div className="truncate" title={profile.email || "N/A"}>
                                {profile.email || "N/A"}
                              </div>
                          </td>
                          {allKeys.map((key) => {
                            const raw = profile.profile_data?.[key];
                            const display = formatValue(key, raw);
                            return (
                            <td key={key} className="px-4 py-3 text-sm text-gray-700 max-w-[200px]">
                              <div className="truncate" title={display}>
                                {display || "-"}
                              </div>
                            </td>
                            );
                          })}

                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(profile.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             );
            }
          