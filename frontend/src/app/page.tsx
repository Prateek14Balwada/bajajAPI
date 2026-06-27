'use client';
import { useState } from 'react';

type ResponseData = {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: any[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: {
    total_trees: number;
    total_cycles: number;
    largest_tree_root: string;
  };
};

export default function Home() {
  const [input, setInput] = useState('[\n  "A->B", "A->C", "B->D", "C->E", "E->F",\n  "X->Y", "Y->Z", "Z->X",\n  "P->Q", "Q->R",\n  "G->H", "G->H", "G->I",\n  "hello", "1->2", "A->"\n]');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResponseData | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      let parsedData;
      try {
        parsedData = JSON.parse(input);
      } catch (e) {
        throw new Error("Bad JSON");
      }

      if (!Array.isArray(parsedData)) {
        throw new Error("Need an array");
      }

      const res = await fetch('https://bajajapi-avbo.onrender.com/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: parsedData })
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>My Node Project</h1>

      <div className="container">
        <p>Type your array here:</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <br /><br />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : 'Submit Data'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {result && (
        <div>
          <h2>Results</h2>

          <table className="summary-table">
            <thead>
              <tr>
                <th>Trees Found</th>
                <th>Cycles Found</th>
                <th>Biggest Root</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{result.summary.total_trees}</td>
                <td>{result.summary.total_cycles}</td>
                <td>{result.summary.largest_tree_root || 'none'}</td>
              </tr>
            </tbody>
          </table>

          <div className="container">
            <h3>Bad Entries:</h3>
            <ul>
              {result.invalid_entries.map((item, i) => <li key={i}>{item}</li>)}
            </ul>

            <h3>Duplicates:</h3>
            <ul>
              {result.duplicate_edges.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>

          <div className="container">
            <h2>Trees:</h2>
            {result.hierarchies.map((h, i) => (
              <div key={i} style={{ marginBottom: '20px', borderBottom: '1px solid black', paddingBottom: '10px' }}>
                <p>
                  <strong>Root is {h.root}</strong>
                  {h.has_cycle && <span style={{ color: 'red' }}> (CYCLE!)</span>}
                  {h.depth && <span> - Depth is {h.depth}</span>}
                </p>

                <p>Tree Data:</p>
                <pre style={{ backgroundColor: '#e0e0e0', padding: '10px', border: '1px solid black', width: '300px' }}>
                  {JSON.stringify(h.tree, null, 2)}
                </pre>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
