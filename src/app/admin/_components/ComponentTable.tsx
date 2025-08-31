import { CustomComponent } from "../../../types/components";
type Props = {
  customOnlyComponents: CustomComponent[];
  builtInNames: string[];
  error: string | null;
};

export default function ComponentTable({ customOnlyComponents, builtInNames, error }: Props) {
    if ( error) return <div className = "text-red-500">Error:{error}</div>
    return(
        <>
        <h2 className="text-xl mt-4 font-semibold mb-4">Components Table</h2>
        <div className="flex-1 m-4 bg-white/70 rounded-xl shadow border border-gray-200">
            
            <div className="flex item-center justify-between mb-4">
                <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-purple-200">
                            <th className="text-left p-4 font-bold text-gray-700">Component Name</th>
                            <th className="text-left p-4 font-bold text-gray-700">Type</th>
                            <th className="text-left p-4 font-bold text-gray-700">Required</th>
                        </tr>
                    </thead>
                    <tbody>
            {customOnlyComponents.map(comp => (
              <tr key={comp.name} className="border-b last:border-none hover:bg-white/20">
                <td className="p-4 bg-purple-100">
                  <div className="flex items-center">
                    <strong className="text-gray-800">{comp.label}</strong>
                    {builtInNames.includes(comp.name) && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Built-in</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{comp.type}</span>
                </td>
                <td className="p-4">
                  {comp.required
                    ? <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Required</span>
                    : <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Optional</span>}
                </td>
                </tr>
            ))}
          </tbody>
                </table>
                </div>
            </div>
        </div>
            </>
    );
}
