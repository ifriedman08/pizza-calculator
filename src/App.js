import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { TextField, InputAdornment } from "@mui/material";

const App = () => {
  const [totalSqFeet, setTotalSqFeet] = useState();
  const [ppl, setPpl] = useState();
  const [numberOfPizzas, setNumberOfPizzas] = useState(1);
  const [diameter, setDiameter] = useState();

  const [sqFtPerPerson, setSqFtPerPerson] = useState();

  useEffect(() => {
    setTotalSqFeet(Math.PI * (diameter / 24) ** 2 * numberOfPizzas);
  }, [diameter, numberOfPizzas]);

  useEffect(() => {
    setSqFtPerPerson(totalSqFeet / ppl);
  }, [totalSqFeet, ppl]);

  return (
    <Box sx={{ gap: 2, flexDirection: "row", margin: 2 }}>
      <div style={{ fontSize: 64 }}>🍕🧮</div>
      <Box sx={{ margin: 1 }}>
        <TextField
          onChange={(e) => setPpl(parseInt(e.target.value || 0))}
          type="number"
          label="n of ppl"
        />
      </Box>
      <Box sx={{ margin: 1 }}>
        <TextField
          onChange={(e) => setNumberOfPizzas(parseInt(e.target.value || 0))}
          type="number"
          label="n of pizzas"
        />
      </Box>
      <Box sx={{ margin: 1 }}>
        <TextField
          onChange={(e) => setDiameter(parseInt(e.target.value || 0))}
          InputProps={{
            endAdornment: <InputAdornment position="end">in.</InputAdornment>,
          }}
          type="number"
          label="pizza diameter"
        />
      </Box>

      {!!totalSqFeet && (
        <Box>
          <div>
            Totals about <strong>{totalSqFeet.toFixed(2)}</strong> square feet
            of pizza
          </div>
        </Box>
      )}
      {!!sqFtPerPerson && (
        <Box>
          <div>
            or <strong>{sqFtPerPerson.toFixed(2)}</strong> square feet per
            person.
          </div>
        </Box>
      )}

      {sqFtPerPerson < 1 && (
        <Box>
          <div>
            We recommend <strong>more</strong> pizza 📈
          </div>
        </Box>
      )}
    </Box>
  );
};

export default App;
