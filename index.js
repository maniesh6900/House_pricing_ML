import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Spawn a python script and return parsed JSON output
const executePython = (script, args = []) =>
  new Promise((resolve, reject) => {
    const pythonBin = process.env.PYTHON_BIN || "python";
    const py = spawn(pythonBin, [path.join(__dirname, script), ...args.map(String)]);

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    py.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    py.on("close", (code) => {
      if (code !== 0 || stderr) {
        console.error(`[python] exited with code ${code}: ${stderr}`);
        return reject(new Error(stderr || `python exited with code ${code}`));
      }
      try {
        const parsed = JSON.parse(stdout);
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Failed to parse python output: ${err.message}; raw=${stdout}`));
      }
    });
  });

app.get("/predict", async (req, res) => {
//   const { num_of_bed, num_of_bath, total_area } = req.body || {};

//   if (
//     num_of_bed === undefined ||
//     num_of_bath === undefined ||
//     total_area === undefined
//   ) {
//     return res.status(400).json({
//       message: "num_of_bed, num_of_bath and total_area are required",
//     });
//   }

  try {
    const result = await executePython("predict.py", [
      3,
      5,
      3350,
    ]);
    res.json(result);
  } catch (error) {
    console.error(`prediction failed: ${error.message}`);
    res.status(500).json({ message: "prediction failed" });
  }
});

app.listen(3001, () => {
  console.log("server is up on http://localhost:3001");
});
