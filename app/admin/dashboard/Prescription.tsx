import axios from "axios";
import { useEffect, useState } from "react";

type Prescription = {
  _id: string;
  name?: string;
  phone?: string;
  age?: string;
  gender?: string;
  dsRE?: string;
  dcRE?: string;
  axisRE?: string;
  addRE?: string;
  pdRE?: string;
  diaRE?: string;
  fhRE?: string;
  dsLE?: string;
  dcLE?: string;
  axisLE?: string;
  addLE?: string;
  pdLE?: string;
  diaLE?: string;
  fhLE?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
};

export default function Priscription() {
  const [prescriptions, setPrescriptions] = useState<Prescription[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrescription = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/get-prescription");
      // expect res.data.prescriptions to be an array of docs that match your schema
      setPrescriptions(res.data?.prescriptions || []);
    } catch (err: any) {
      console.error("Error fetching prescriptions:", err);
      setError("Failed to load prescriptions. Try again later.");
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescription();
    // run once on mount
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-pulse text-gray-500">Loading prescriptions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      </div>
    );
  }

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-400">No prescriptions found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Prescriptions
      </h2>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {prescriptions.map((p) => (
          <article
            key={p._id}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-lg transition-shadow duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {p.name ?? "Unnamed"}
                </h3>
                <div className="text-sm text-gray-500 mt-1">
                  <span>{p.phone ?? "—"}</span>
                  <span className="mx-2">•</span>
                  <span>{p.age ? `${p.age} yrs` : "Age —"}</span>
                  {p.gender ? <span className="mx-2">•</span> : null}
                  <span className="capitalize">{p.gender ?? ""}</span>
                </div>
              </div>

              <div className="text-right text-xs text-gray-400">
                <div>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}</div>
                <div>{p.createdAt ? new Date(p.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}</div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 my-2" />

            {/* Prescription table (compact) */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-2"></th>
                    <th className="pb-2 text-center">DS</th>
                    <th className="pb-2 text-center">DC</th>
                    <th className="pb-2 text-center">Axis</th>
                    <th className="pb-2 text-center">Add</th>
                    <th className="pb-2 text-center">PD</th>
                    <th className="pb-2 text-center">Dia</th>
                    <th className="pb-2 text-center">FH</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="align-top">
                    <td className="py-2 font-semibold text-blue-600">RE</td>
                    <td className="py-2 text-center text-gray-700">{p.dsRE ?? "—"}</td>
                    <td className="py-2 text-center text-gray-700">{p.dcRE ?? "—"}</td>
                    <td className="py-2 text-center text-gray-700">{p.axisRE ?? "—"}</td>
                    <td className="py-2 text-center text-gray-700">{p.addRE ?? "—"}</td>
                    <td className="py-2 text-center text-gray-700">{p.pdRE ?? "—"}</td>
                    <td className="py-2 text-center text-gray-700">{p.diaRE ?? "—"}</td>
                    <td className="py-2 text-center text-gray-700">{p.fhRE ?? "—"}</td>
                  </tr>

                  <tr className="align-top">
                    <td className="py-2 font-semibold text-blue-600">LE</td>
                    <td className="py-2 text-center text-gray-700">{p.dsLE ?? "—"}</td>
                    <td className="py-2 text-center text-gray-700">{p.dcLE ?? "—"}</td>
                    <td className="py-2 text-center text-gray-700">{p.axisLE ?? "—"}</td>
                    <td className="py-2 text-center text-gray-700">{p.addLE ?? "—"}</td>
                    <td className="py-2 text-center text-gray-700">{p.pdLE ?? "—"}</td>
                    <td className="py-2 text-center text-gray-700">{p.diaLE ?? "—"}</td>
                    <td className="py-2 text-center text-gray-700">{p.fhLE ?? "—"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer actions / notes */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                ID: <span className="text-gray-400">{p._id.slice(-6)}</span>
              </div>
              <div>
                <button
                  onClick={() => navigator.clipboard?.writeText(JSON.stringify(p))}
                  className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                >
                  Copy JSON
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
