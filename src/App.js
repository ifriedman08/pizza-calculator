import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  Divider,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";

// Square feet of pizza per person.
// Reference: a 14" large is ~1.07 sq ft (8 slices); a typical adult eats
// ~3 slices of a large, i.e. ~0.4 sq ft.
export const THRESHOLDS = {
  notEnough: 0.3, // below this: people will go hungry
  justRight: 0.5, // up to this: about right
  generous: 0.75, // up to this: leftovers likely; above: way too much
};

export const getVerdict = (sqFtPerPerson) => {
  if (sqFtPerPerson < THRESHOLDS.notEnough)
    return {
      label: "Not enough",
      color: "error",
      emoji: "📈",
      message: "Order more pizza — people will go hungry.",
    };
  if (sqFtPerPerson < THRESHOLDS.justRight)
    return {
      label: "Just right",
      color: "success",
      emoji: "👌",
      message: "That should feed everyone nicely.",
    };
  if (sqFtPerPerson < THRESHOLDS.generous)
    return {
      label: "Generous",
      color: "info",
      emoji: "📦",
      message: "Plenty to go around — expect some leftovers.",
    };
  return {
    label: "Too much",
    color: "warning",
    emoji: "📉",
    message: "You could probably order less.",
  };
};

const NEON = {
  pink: "#ff2bd6",
  cyan: "#00f0ff",
  green: "#39ff14",
  yellow: "#ffe600",
  red: "#ff3864",
  bg: "#0a0014",
  panel: "rgba(20, 0, 40, 0.82)",
};

const glow = (c, s = 8) => `0 0 ${s}px ${c}, 0 0 ${s * 2.5}px ${c}`;
const DISPLAY_FONT = '"Orbitron", "Share Tech Mono", monospace';

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: NEON.pink },
    secondary: { main: NEON.cyan },
    error: { main: NEON.red, contrastText: "#0a0014" },
    success: { main: NEON.green, contrastText: "#0a0014" },
    info: { main: NEON.cyan, contrastText: "#0a0014" },
    warning: { main: NEON.yellow, contrastText: "#0a0014" },
    background: { default: NEON.bg, paper: NEON.panel },
    text: { primary: "#f4e9ff", secondary: "#b58cff" },
    divider: "rgba(0, 240, 255, 0.35)",
  },
  shape: { borderRadius: 2 },
  typography: {
    fontFamily: '"Share Tech Mono", "Courier New", monospace',
    fontSize: 15,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: NEON.bg,
          backgroundImage: `
            linear-gradient(rgba(255, 43, 214, 0.09) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.09) 1px, transparent 1px),
            radial-gradient(ellipse at top, #2a0050 0%, ${NEON.bg} 65%)`,
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
          backgroundAttachment: "fixed",
        },
        "body::after": {
          // CRT scanlines
          content: '""',
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `2px solid ${NEON.pink}`,
          boxShadow: `${glow(NEON.pink, 10)}, inset 0 0 24px rgba(255, 43, 214, 0.25)`,
          backdropFilter: "blur(4px)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 240, 255, 0.05)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 240, 255, 0.55)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: NEON.cyan,
          },
          // drop-shadow (unlike box-shadow) follows the drawn border, so the
          // glow skips the notch where the label sits.
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: NEON.cyan,
            filter: `drop-shadow(0 0 4px ${NEON.cyan})`,
          },
        },
        input: { color: NEON.cyan, fontSize: 18 },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "#e6d6ff",
          fontWeight: 700,
          textShadow: `0 0 3px ${NEON.bg}, 0 0 6px ${NEON.bg}, 0 0 10px ${NEON.bg}`,
          "&.Mui-focused": { color: NEON.cyan },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: DISPLAY_FONT,
          textTransform: "uppercase",
          letterSpacing: 2,
          borderRadius: 2,
        },
      },
    },
  },
});

const parse = (value) => {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const Stat = ({ value, label, color }) => (
  <Box sx={{ flex: 1, textAlign: "center" }}>
    <Typography
      variant="h4"
      sx={{
        fontFamily: DISPLAY_FONT,
        fontWeight: 700,
        color,
        textShadow: glow(color, 6),
      }}
    >
      {value}
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ textTransform: "uppercase", letterSpacing: 1 }}
    >
      {label}
    </Typography>
  </Box>
);

const App = () => {
  const [ppl, setPpl] = useState("");
  const [numberOfPizzas, setNumberOfPizzas] = useState("1");
  const [diameter, setDiameter] = useState("14");

  const result = useMemo(() => {
    const p = parse(ppl);
    const n = parse(numberOfPizzas);
    const d = parse(diameter);
    if (!p || !n || !d) return null;

    const sqFtPerPizza = Math.PI * (d / 24) ** 2;
    const total = sqFtPerPizza * n;
    const perPerson = total / p;
    const target = ((THRESHOLDS.notEnough + THRESHOLDS.justRight) / 2) * p;
    return {
      total,
      perPerson,
      verdict: getVerdict(perPerson),
      suggested: Math.max(1, Math.ceil(target / sqFtPerPizza)),
      d,
    };
  }, [ppl, numberOfPizzas, diameter]);

  const meterMax = THRESHOLDS.generous * 1.33;

  // On phones, scroll the focused field to the top of the viewport so the
  // results below it stay visible above the on-screen keyboard.
  const [keyboardSpace, setKeyboardSpace] = useState(false);
  const isPhone = () =>
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse) and (max-width: 599px)").matches;

  const handleFocus = (e) => {
    if (!isPhone()) return;
    setKeyboardSpace(true);
    const field = e.target.closest(".MuiTextField-root") || e.target;
    // wait for the keyboard to finish opening (and the browser's own
    // scroll-into-view) before positioning the field
    setTimeout(() => {
      const top = field.getBoundingClientRect().top + window.scrollY - 16;
      window.scrollTo({ top, behavior: "smooth" });
    }, 300);
  };
  const handleBlur = () => setKeyboardSpace(false);
  const focusProps = { onFocus: handleFocus, onBlur: handleBlur };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: { xs: "flex-start", sm: "center" },
          p: 2,
          // extra room at the bottom so a field can scroll to the very top
          pb: keyboardSpace ? "70vh" : 2,
        }}
      >
        <Card elevation={3} sx={{ width: "100%", maxWidth: 440 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Stack spacing={3}>
              <Box textAlign="center">
                <Typography
                  fontSize={{ xs: 40, sm: 56 }}
                  lineHeight={1}
                  sx={{ filter: `drop-shadow(0 0 10px ${NEON.yellow})` }}
                >
                  🍕
                </Typography>
                <Typography
                  variant="h5"
                  mt={1.5}
                  sx={{
                    fontFamily: DISPLAY_FONT,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: 3,
                    color: NEON.pink,
                    textShadow: glow(NEON.pink),
                  }}
                >
                  Pizza Calculator
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: NEON.cyan,
                    textShadow: glow(NEON.cyan, 4),
                    letterSpacing: 2,
                  }}
                >
                  &gt; is it enough pizza?_
                </Typography>
              </Box>

              <Stack spacing={2.5}>
                <TextField
                  label="Number of people"
                  type="number"
                  value={ppl}
                  onChange={(e) => setPpl(e.target.value)}
                  {...focusProps}
                  inputProps={{ min: 1, inputMode: "numeric", enterKeyHint: "done" }}
                  autoFocus
                  fullWidth
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Pizzas"
                    type="number"
                    value={numberOfPizzas}
                    onChange={(e) => setNumberOfPizzas(e.target.value)}
                    {...focusProps}
                    inputProps={{ min: 1, inputMode: "numeric" }}
                    fullWidth
                  />
                  <TextField
                    label="Diameter"
                    type="number"
                    value={diameter}
                    onChange={(e) => setDiameter(e.target.value)}
                    {...focusProps}
                    inputProps={{ min: 1, step: 0.5, inputMode: "decimal" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">in.</InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </Stack>
              </Stack>

              <Divider />

              {result ? (
                <Stack spacing={2.5}>
                  <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                  >
                    <Stat
                      value={result.total.toFixed(2)}
                      label="sq ft total"
                      color={NEON.cyan}
                    />
                    <Stat
                      value={result.perPerson.toFixed(2)}
                      label="sq ft / person"
                      color={NEON.pink}
                    />
                  </Stack>

                  <Box>
                    <LinearProgress
                      variant="determinate"
                      color={result.verdict.color}
                      value={Math.min(100, (result.perPerson / meterMax) * 100)}
                      sx={(t) => ({
                        height: 10,
                        borderRadius: 0,
                        backgroundColor: "rgba(255,255,255,0.08)",
                        boxShadow: glow(t.palette[result.verdict.color].main, 4),
                      })}
                    />
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      mt={0.5}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Hungry
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Stuffed
                      </Typography>
                    </Stack>
                  </Box>

                  <Box textAlign="center">
                    <Chip
                      label={`${result.verdict.emoji} ${result.verdict.label}`}
                      color={result.verdict.color}
                      variant="outlined"
                      sx={(t) => {
                        const c = t.palette[result.verdict.color].main;
                        return {
                          fontWeight: 700,
                          fontSize: 15,
                          px: 1,
                          py: 2.5,
                          color: c,
                          backgroundColor: NEON.bg,
                          border: `2px solid ${c}`,
                          textShadow: glow(c, 4),
                          boxShadow: `${glow(c, 6)}, inset 0 0 10px ${c}55`,
                        };
                      }}
                    />
                    <Typography mt={1.5}>{result.verdict.message}</Typography>
                    {result.verdict.label !== "Just right" && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={0.5}
                      >
                        Suggested: <strong>{result.suggested}</strong> ×{" "}
                        {result.d}" {result.suggested === 1 ? "pizza" : "pizzas"}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              ) : (
                <Typography color="text.secondary" textAlign="center">
                  Enter the number of people, pizzas and size to see if it's
                  enough.
                </Typography>
              )}

              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
              >
                Rule of thumb: ~0.4 sq ft per person (about 3 slices of a 14"
                pizza).
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default App;
