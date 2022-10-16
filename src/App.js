import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { TextField, MenuItem, Select, InputAdornment } from "@mui/material";

const App = () => {
  const [totalSqFeet, setTotalSqFeet] = useState();
  const [ppl, setPpl] = useState();
  const [numberOfPizzas, setNumberOfPizzas] = useState(1);
  const [radius, setRadius] = useState();
  const [hungerLevel, setHungerLevel] = useState(1.5);
  const [sqFtPerPerson, setSqFtPerPerson] = useState();

  useEffect(() => {
    setTotalSqFeet(Math.PI * (radius / 12) ** 2 * numberOfPizzas);
  }, [radius, numberOfPizzas]);

  useEffect(() => {
    setSqFtPerPerson(totalSqFeet / ppl);
  }, [totalSqFeet, ppl]);

  console.log({ sqFtPerPerson, hungerLevel });
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
          onChange={(e) => setRadius(parseInt(e.target.value || 0))}
          InputProps={{
            endAdornment: <InputAdornment position="end">in.</InputAdornment>,
          }}
          type="number"
          label="pizza radius"
        />
      </Box>

      <Box sx={{ margin: 1 }}>
        We are{" "}
        <Select
          label="We are"
          onChange={(e) => setHungerLevel(parseInt(e.target.value || 0))}
          labelId="hungerLabel"
          id="select"
          value={hungerLevel}
        >
          <MenuItem value={1}>kinda hungry</MenuItem>
          <MenuItem value={1.5}>hungry</MenuItem>
          <MenuItem value={2}>hella hungry</MenuItem>
        </Select>
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

      {sqFtPerPerson < hungerLevel - 0.3 && (
        <Box>
          <div>
            We recommend <strong>more</strong> pizza 📈
          </div>
        </Box>
      )}

      {sqFtPerPerson > hungerLevel + 0.3 && (
        <Box>
          <div>
            We recommend <strong>less</strong> pizza ⬇️
          </div>
        </Box>
      )}

      {sqFtPerPerson - hungerLevel < 0.3 && (
        <Box>
          <div>
            That's <strong>a good amount</strong> of pizza 👍
          </div>
        </Box>
      )}
    </Box>
  );
};

export default App;
