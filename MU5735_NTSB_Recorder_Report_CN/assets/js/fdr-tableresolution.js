(function () {
  const scriptUrl = document.currentScript?.src || new URL("../../assets/js/fdr-tableresolution.js", document.baseURI).href;
  const GROUPS = [
    ["air", "气动 / 高度", "Air data", ["Air Gnd On Gnd", "AIR GROUND - SMYDC-2", "Air-Ground", "Airspeed Comp", "Airspeed Max Allowable", "Airspeed Target FCC", "Alt 1 Baro Corr", "Alt 2 Baro Corr", "Alt 3 Baro Corr", "Alt 4 Baro Corr", "Alt Baro Corr Combine", "Altitude Press", "Altitude Radio DEU", "Altitude Radio-1", "Altitude Radio-2", "FMC Selected Airspeed", "FMC Selected Altitude", "FMC Selected Mach", "Ground Spd", "Groundspeed  FMC", "Groundspeed Disp -L", "Heading", "Heading Selected FCC", "High Speed Buffet Speed", "Selected Airspeed FCC"]],
    ["inertial", "惯性 / 姿态", "Inertial / attitude", ["Absolute Roll Rate", "Accel Lat", "Accel Long", "Accel Vert", "Drift Angle -FMC", "Pitch Angle", "Roll Angle", "Roll Rate", "Track Angle True FMC", "Wind Direction True -FMC", "Wind Speed -FMC", "Yaw Rate", "Selected Course Foreign FCC", "Selected Course Local FCC", "Selected Vertical Speed FCC"]],
    ["engines", "发动机", "Engines", ["APU N1", "APU On", "APU Ready To Load", "Eng1 Cutoff SW", "Eng1 EGT", "Eng1 Fire", "Eng1 FMC N1 Bug Drive", "Eng1 FMC N1 Target", "Eng1 FMV Pos", "Eng1 Fuel Flow", "Eng1 N1", "Eng1 N1 Cmd", "Eng1 N1 Ref", "Eng1 N1 Tach", "Eng1 N2 Actual", "Eng1 N2 Tach", "Eng1 Oil Press", "Eng1 Oil Qty", "Eng1 Oil Temp", "Eng1 TRA", "Eng2 Cutoff SW", "Eng2 EGT", "Eng2 Fire", "Eng2 FMC N1 Bug Drive", "Eng2 FMC N1 Target", "Eng2 FMV Pos", "Eng2 Fuel Flow", "Eng2 N1", "Eng2 N1 Cmd", "Eng2 N1 Ref", "Eng2 N1 Tach", "Eng2 N2 Actual", "Eng2 N2 Tach", "Eng2 Oil Press", "Eng2 Oil Qty", "Eng2 Oil Temp", "Eng2 TRA", "N1 Light - FCC", "N1 Limit Mode Cmd - FCC"]],
    ["controls", "飞行操纵", "Flight controls", ["Aileron Actuator Pos-L", "Aileron Quadrant Pos", "Aileron Roll Cmd-L", "Aileron-L", "Aileron-R", "Ctrl Col Force Pitch CWS", "Ctrl Col Force Pitch CWS Foreign", "Ctrl Col Force Pitch CWS Local", "Ctrl Col Pos-L", "Ctrl Col Pos-R", "Ctrl Whl Force Roll CWS", "Ctrl Whl Pos-L", "Ctrl Whl Pos-R", "Elevator Actuator Pos-L", "Elevator Pitch Cmd-L", "Elevator-L", "Elevator-R", "Flap Handle Pos", "Flap-L", "Flap-R", "Rudder", "Rudder Ped Pos", "Rudder Pos- LVDT DEMOD-STBY PCU", "Rudder Servo Cmd-STBY PCU"]],
    ["autopilot", "自动驾驶 / FCC", "Autopilot / FCC", ["Active Altitude Ref - FCC", "ALT ACQ Engaged - FCC", "ALT HOLD Engaged - FCC", "AP Off - FCC", "AP-1 Warn", "AP-2 Warn", "AT FMC SPD Engaged", "CMD A - FCC", "CMD A Light - FCC", "CMD B Light - FCC", "FAC Engage - FCC", "FCC In Command of MACH Trim - R", "FCC-L In Command of MACH Trim", "FD-A Switch - FCC", "FD-B Switch - FCC", "FMC Valid", "G/S Dev Warn - FCC", "GP Engage - FCC", "GS Engaged - FCC", "HDG SEL Light - FCC", "HDG SELECT - FCC", "IAS Display - FCC", "LNAV Engaged - FCC", "LNAV Light - FCC", "LOC Engaged - FCC", "LOCAL LIMITED MASTER FCC-L", "LOCAL LIMITED MASTER FCC-R", "LVL Change Light - FCC", "Single Channel - FCC", "SPD Light On - FCC", "SPEED INTERVENTION ACTIVE - FCC", "TOGA Engaged - FCC", "VISUAL ALTITUDE ALERT - FCC", "VNAV Light On - FCC", "VNAV PATH Engaged - FCC", "VNAV SPD Engaged - FCC"]],
    ["hydraulics", "液压", "Hydraulics", ["Hyd Oil Press - A", "Hyd Oil Press - B", "Hyd Oil Qty - A", "Hyd Oil Qty - B", "Hydraulic Oil Pressure Standby"]],
    ["electrical", "电源", "Electrical", ["115 VAC Stdby Bus Sect 2", "115 VAC XFR Bus 2", "115VAC UNAVAIL TO L IGN 1", "115VAC UNAVAIL TO L IGN 2", "115VAC UNAVAIL TO R IGN 1", "115VAC UNAVAIL TO R IGN 2", "28 VDC BAT BUS SECT 2", "28 VDC BUS 1 SECT 2", "28 VDC BUS 2 SECT 3", "28 VDC HOT BAT BUS", "28 VDC STDBY BUS SECT 2", "28 VDC SW HOT BAT BUS S1", "Hydraulic System A ELEC", "Hydraulic System B ELEC", "MACH Trim Servo Brake Status - FCC-L"]],
    ["other", "其他", "Other", ["Hydraulic System A Eng 1", "Hydraulic System B Eng 2", "Hydraulic System Standby", "Selected Altitude FCC", "Selected Mach FCC"]]
  ];

  const COLORS = ["#1565c0", "#c62828", "#2e7d32", "#6a1b9a", "#ef6c00", "#00838f"];
  const app = document.getElementById("fdr-app");
  if (!app) return;
  document.body.classList.add("fdr-fullscreen-page");

  const state = {
    headers: [],
    units: [],
    types: [],
    rows: [],
    signals: [],
    selected: new Set(["Pitch Angle", "Roll Angle"]),
    zoom: null,
    drag: null
  };

  const els = {
    search: document.getElementById("fdr-search"),
    selectedCount: document.getElementById("fdr-selected-count"),
    clear: document.getElementById("fdr-clear"),
    groups: document.getElementById("fdr-groups"),
    status: document.getElementById("fdr-status"),
    charts: document.getElementById("fdr-charts"),
    resetZoom: document.getElementById("fdr-reset-zoom"),
    download: document.getElementById("fdr-download"),
    home: document.querySelector("[data-fdr-home]")
  };

  const csvUrl = resolveAssetUrl(app.dataset.csv || "../data/TableResolution.csv");
  if (els.download) els.download.href = csvUrl;
  if (els.home) els.home.href = resolveAssetUrl("../../");

  fetch(csvUrl)
    .then((response) => {
      if (!response.ok) throw new Error("CSV request failed: " + response.status);
      return response.text();
    })
    .then(loadCsv)
    .catch((error) => {
      els.status.textContent = error.message;
      els.charts.innerHTML = '<div class="fdr-empty">CSV 加载失败。</div>';
    });

  function loadCsv(text) {
    const parsed = parseCsv(text);
    const dataIndex = parsed.findIndex((row) => row[0] === "DATA");
    if (dataIndex < 0) throw new Error("CSV missing DATA section");
    state.headers = parsed[dataIndex + 1];
    state.units = parsed[dataIndex + 2];
    state.types = parsed[dataIndex + 3];
    if (!state.headers?.length || !state.units?.length || !state.types?.length) {
      throw new Error("CSV header section is incomplete");
    }
    state.rows = parsed.slice(dataIndex + 4).filter((row) => row.length > 1);
    state.signals = state.headers.slice(1).map((name, offset) => {
      const index = offset + 1;
      const values = state.rows.map((row) => row[index] || "");
      return {
        name,
        index,
        unit: cleanUnit(state.units[index]),
        type: state.types[index] || "",
        kind: inferKind(state.types[index], values),
        labels: inferLabels(state.types[index], values),
        sampleInterval: inferSampleInterval(index)
      };
    });
    const start = Number(state.rows[0][0]);
    const end = Number(state.rows[state.rows.length - 1][0]);
    state.zoom = [start, end];
    els.status.textContent = `${state.rows.length.toLocaleString()} rows · ${state.signals.length} signals`;
    renderSelector();
    renderCharts();
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;
    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      const next = text[i + 1];
      if (quoted) {
        if (ch === '"' && next === '"') {
          cell += '"';
          i += 1;
        } else if (ch === '"') {
          quoted = false;
        } else {
          cell += ch;
        }
      } else if (ch === '"') {
        quoted = true;
      } else if (ch === ",") {
        row.push(cell);
        cell = "";
      } else if (ch === "\n") {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else if (ch !== "\r") {
        cell += ch;
      }
    }
    row.push(cell);
    rows.push(row);
    return rows;
  }

  function cleanUnit(unit) {
    return (unit || "").replace(/^\(|\)$/g, "");
  }

  function inferKind(type, values) {
    if (type && type !== "NUMBER") return "discrete";
    const unique = new Set(values.filter(Boolean));
    const binary = unique.size > 0 && [...unique].every((value) => value === "0" || value === "1" || value === "0.0" || value === "1.0");
    return binary ? "discrete" : "number";
  }

  function inferLabels(type, values) {
    const labels = new Map();
    const re = /(-?\d+(?:\.\d+)?):[-?\d.]+="([^"]*)"/g;
    let match;
    while ((match = re.exec(type || ""))) labels.set(String(Number(match[1])), match[2]);
    if (labels.size) return labels;
    const unique = [...new Set(values.filter(Boolean))];
    unique.forEach((value) => labels.set(value, value));
    return labels;
  }

  function renderSelector() {
    const query = els.search.value.trim().toLowerCase();
    els.groups.innerHTML = "";
    GROUPS.forEach(([id, zh, en, names], groupIndex) => {
      const details = document.createElement("details");
      details.className = "fdr-group";
      details.open = groupIndex < 2 || Boolean(query);
      const visibleNames = names.filter((name) => name.toLowerCase().includes(query));
      if (!visibleNames.length && query) return;
      details.innerHTML = `
        <summary>
          <span class="fdr-caret">▶</span>
          <span class="fdr-group-name">${zh} <span>${en}</span></span>
          <span class="fdr-group-count">${names.length}</span>
        </summary>
        <div class="fdr-signal-list"></div>
      `;
      const list = details.querySelector(".fdr-signal-list");
      visibleNames.forEach((name) => {
        const signal = state.signals.find((item) => item.name === name);
        if (!signal) return;
        const label = document.createElement("label");
        label.className = "fdr-signal";
        label.innerHTML = `
          <input type="checkbox" value="${escapeAttr(name)}" ${state.selected.has(name) ? "checked" : ""}>
          <span>${escapeHtml(name)}<small>${signal.kind === "number" ? signal.unit || "NUMBER" : "discrete"}</small></span>
        `;
        list.appendChild(label);
      });
      els.groups.appendChild(details);
    });
    updateSelectedCount();
  }

  function updateSelectedCount() {
    els.selectedCount.textContent = `${state.selected.size} / ${state.signals.length} selected`;
  }

  function renderCharts() {
    const selected = state.signals.filter((signal) => state.selected.has(signal.name));
    els.charts.innerHTML = "";
    updateSelectedCount();
    if (!selected.length) {
      els.charts.innerHTML = '<div class="fdr-empty">请选择左侧信号。</div>';
      return;
    }
    selected.forEach((signal, index) => {
      const wrap = document.createElement("article");
      wrap.className = "fdr-chart";
      wrap.innerHTML = `
        <div class="fdr-chart-header">
          <div class="fdr-chart-title">${escapeHtml(signal.name)}</div>
          <div class="fdr-chart-meta">${signal.kind === "number" ? escapeHtml(signal.unit || "NUMBER") : "discrete"} · drag to zoom</div>
        </div>
        <canvas height="220"></canvas>
      `;
      els.charts.appendChild(wrap);
      drawChart(wrap.querySelector("canvas"), signal, COLORS[index % COLORS.length]);
    });
  }

  function drawChart(canvas, signal, color) {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(400, Math.floor(rect.width * ratio));
    canvas.height = Math.floor(220 * ratio);
    const ctx = canvas.getContext("2d");
    ctx.scale(ratio, ratio);
    const width = canvas.width / ratio;
    const height = canvas.height / ratio;
    const pad = { left: 54, right: 18, top: 16, bottom: 28 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;
    const [xMin, xMax] = state.zoom;
    const points = collectPoints(signal, xMin, xMax);
    const yInfo = signal.kind === "number" ? numericRange(points) : discreteRange(points, signal);

    ctx.clearRect(0, 0, width, height);
    drawAxes(ctx, width, height, pad, xMin, xMax, yInfo);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    signal.kind === "number"
      ? drawContinuous(ctx, points, signal, pad, plotW, plotH, xMin, xMax, yInfo)
      : drawDiscrete(ctx, points, signal, pad, plotW, plotH, xMin, xMax, yInfo);

    canvas.onpointerdown = (event) => {
      state.drag = { canvas, startX: event.offsetX, endX: event.offsetX };
      canvas.setPointerCapture(event.pointerId);
    };
    canvas.onpointermove = (event) => {
      if (!state.drag || state.drag.canvas !== canvas) return;
      state.drag.endX = event.offsetX;
      drawChart(canvas, signal, color);
      drawSelection(ctx, state.drag.startX, state.drag.endX, height, pad);
    };
    canvas.onpointerup = () => {
      if (!state.drag || state.drag.canvas !== canvas) return;
      const a = Math.min(state.drag.startX, state.drag.endX);
      const b = Math.max(state.drag.startX, state.drag.endX);
      state.drag = null;
      if (b - a > 8) {
        const nextMin = xMin + ((a - pad.left) / plotW) * (xMax - xMin);
        const nextMax = xMin + ((b - pad.left) / plotW) * (xMax - xMin);
        state.zoom = [Math.max(xMin, nextMin), Math.min(xMax, nextMax)];
        renderCharts();
      }
    };
  }

  function collectPoints(signal, xMin, xMax) {
    const points = [];
    state.rows.forEach((row, rowIndex) => {
      const time = Number(row[0]);
      if (time < xMin || time > xMax) return;
      const raw = row[signal.index] || "";
      if (!raw) return;
      const y = signal.kind === "number" ? Number(raw) : labelIndex(raw, signal);
      if (Number.isFinite(y)) points.push({ time, y, raw, rowIndex });
    });
    return points;
  }

  function labelIndex(raw, signal) {
    const labels = [...signal.labels.keys()];
    const normalized = String(Number(raw));
    let index = labels.indexOf(normalized);
    if (index < 0) index = labels.indexOf(raw);
    if (index < 0) {
      signal.labels.set(raw, raw);
      index = signal.labels.size - 1;
    }
    return index;
  }

  function numericRange(points) {
    const values = points.map((point) => point.y).filter(Number.isFinite).sort((a, b) => a - b);
    if (!values.length) return { min: 0, max: 1, labels: [] };
    let min = values[0];
    let max = values[values.length - 1];
    const p1 = values[Math.floor(values.length * 0.01)];
    const p99 = values[Math.floor(values.length * 0.99)];
    if (values.length > 20 && p99 > p1 && (max - min) > (p99 - p1) * 8) {
      min = p1;
      max = p99;
    }
    if (min === max) {
      min -= 1;
      max += 1;
    }
    return { min, max, labels: [] };
  }

  function discreteRange(points, signal) {
    const labels = [...signal.labels.values()];
    return { min: -0.5, max: Math.max(0.5, labels.length - 0.5), labels };
  }

  function drawAxes(ctx, width, height, pad, xMin, xMax, yInfo) {
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;
    ctx.strokeStyle = "#d9dee8";
    ctx.lineWidth = 1;
    ctx.strokeRect(pad.left, pad.top, plotW, plotH);
    ctx.fillStyle = "#758091";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    if (yInfo.labels.length) {
      yInfo.labels.forEach((label, i) => {
        const y = pad.top + plotH - ((i - yInfo.min) / (yInfo.max - yInfo.min)) * plotH;
        ctx.fillText(String(label).slice(0, 18), pad.left - 7, y);
        grid(ctx, pad.left, y, plotW);
      });
    } else {
      for (let i = 0; i <= 4; i += 1) {
        const value = yInfo.min + (i / 4) * (yInfo.max - yInfo.min);
        const y = pad.top + plotH - (i / 4) * plotH;
        ctx.fillText(formatNumber(value), pad.left - 7, y);
        grid(ctx, pad.left, y, plotW);
      }
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let i = 0; i <= 4; i += 1) {
      const value = xMin + (i / 4) * (xMax - xMin);
      const x = pad.left + (i / 4) * plotW;
      ctx.fillText(formatNumber(value), x, height - pad.bottom + 8);
    }
  }

  function grid(ctx, x, y, width) {
    ctx.save();
    ctx.strokeStyle = "#eef1f6";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.stroke();
    ctx.restore();
  }

  function drawContinuous(ctx, points, signal, pad, plotW, plotH, xMin, xMax, yInfo) {
    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const cur = points[i];
      if (!sameSampleRun(prev, cur, signal)) continue;
      ctx.beginPath();
      ctx.moveTo(xPos(prev.time, pad, plotW, xMin, xMax), yPos(prev.y, pad, plotH, yInfo));
      ctx.lineTo(xPos(cur.time, pad, plotW, xMin, xMax), yPos(cur.y, pad, plotH, yInfo));
      ctx.stroke();
    }
  }

  function drawDiscrete(ctx, points, signal, pad, plotW, plotH, xMin, xMax, yInfo) {
    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const cur = points[i];
      if (!sameSampleRun(prev, cur, signal)) continue;
      const x1 = xPos(prev.time, pad, plotW, xMin, xMax);
      const x2 = xPos(cur.time, pad, plotW, xMin, xMax);
      const y1 = yPos(prev.y, pad, plotH, yInfo);
      const y2 = yPos(cur.y, pad, plotH, yInfo);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  function xPos(value, pad, plotW, xMin, xMax) {
    return pad.left + ((value - xMin) / (xMax - xMin)) * plotW;
  }

  function yPos(value, pad, plotH, yInfo) {
    return pad.top + plotH - ((value - yInfo.min) / (yInfo.max - yInfo.min)) * plotH;
  }

  function inferSampleInterval(index) {
    const diffs = [];
    let previousTime = null;
    for (const row of state.rows) {
      const raw = row[index] || "";
      if (!raw) continue;
      const time = Number(row[0]);
      if (!Number.isFinite(time)) continue;
      if (previousTime !== null) {
        const diff = time - previousTime;
        if (diff > 0) diffs.push(diff);
      }
      previousTime = time;
    }
    if (!diffs.length) return 0;
    diffs.sort((a, b) => a - b);
    return diffs[Math.floor(diffs.length / 2)];
  }

  function sameSampleRun(prev, cur, signal) {
    if (!signal.sampleInterval) return cur.rowIndex === prev.rowIndex + 1;
    const tolerance = Math.max(signal.sampleInterval * 1.6, signal.sampleInterval + 1e-6);
    return cur.time - prev.time <= tolerance;
  }

  function drawSelection(ctx, x1, x2, height, pad) {
    const a = Math.min(x1, x2);
    const b = Math.max(x1, x2);
    ctx.save();
    ctx.fillStyle = "rgba(21, 101, 192, .14)";
    ctx.fillRect(a, pad.top, b - a, height - pad.top - pad.bottom);
    ctx.restore();
  }

  function formatNumber(value) {
    if (Math.abs(value) >= 1000) return value.toFixed(0);
    if (Math.abs(value) >= 10) return value.toFixed(1);
    return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function resolveAssetUrl(path) {
    try {
      return new URL(path, scriptUrl).href;
    } catch {
      return path;
    }
  }

  els.search.addEventListener("input", renderSelector);
  els.groups.addEventListener("change", (event) => {
    if (event.target.type !== "checkbox") return;
    if (event.target.checked) state.selected.add(event.target.value);
    else state.selected.delete(event.target.value);
    renderCharts();
  });
  els.clear.addEventListener("click", () => {
    state.selected.clear();
    renderSelector();
    renderCharts();
  });
  els.resetZoom.addEventListener("click", () => {
    if (!state.rows.length) return;
    state.zoom = [Number(state.rows[0][0]), Number(state.rows[state.rows.length - 1][0])];
    renderCharts();
  });
  window.addEventListener("resize", () => {
    if (state.rows.length) renderCharts();
  });
})();
