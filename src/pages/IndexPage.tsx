import { Link } from 'react-router-dom'
import PRESENTATIONS from '../data/presentations'

export default function IndexPage() {
  const entries = Object.entries(PRESENTATIONS || {})

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Índice de presentaciones</h1>
      {entries.length === 0 ? (
        <div className="text-gray-600">No hay presentaciones disponibles.</div>
      ) : (
        <div className="overflow-auto bg-white rounded shadow">
          <table className="min-w-full text-left table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Id</th>
                <th className="px-4 py-2 border">Asignatura</th>
                <th className="px-4 py-2 border">Unidad</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([id, data]) => (
                <tr key={id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2 border font-mono text-sm">
                    <Link to={`/class/${id}`} className="text-blue-600 underline">{id}</Link>
                  </td>
                  <td className="px-4 py-2 border">{data?.metadata?.subject || '-'}</td>
                  <td className="px-4 py-2 border">{data?.metadata?.unit || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
