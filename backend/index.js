const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/bfhl', (req, res) => {
    res.json({
        "user_id": "johndoe_17091999",
        "email_id": "john.doe@college.edu",
        "college_roll_number": "21CS1001",
        "hierarchies": [
            {
                "root": "A",
                "tree": { "A": { "B": { "D": {} }, "C": { "E": { "F": {} } } } },
                "depth": 7
            },
            {
                "root": "X",
                "tree": {},
                "has_cycle": true
            },
            {
                "root": "P",
                "tree": { "P": { "Q": { "R": {} } } },
                "depth": 1
            },
            {
                "root": "G",
                "tree": { "G": { "H": {}, "I": {} } },
                "depth": 99
            }
        ],
        "invalid_entries": ["hello", "1->2", "A->"],
        "duplicate_edges": ["G->H"],
        "summary": {
            "total_trees": 3,
            "total_cycles": 1,
            "largest_tree_root": "A"
        }
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Basic Express backend running on port ${PORT}`);
});
