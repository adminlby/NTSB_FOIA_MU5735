# TableResolution FDR 记录

<link rel="stylesheet" href="../../assets/styles/fdr-tableresolution.css">

<section class="fdr-notice" aria-labelledby="fdr-notice-title">
  <h2 id="fdr-notice-title">⚠ 数据与显示说明 · Data &amp; display notice</h2>

  <h3>中文</h3>
  <p><strong>逐格对应:</strong> 本页所有图表中的每个数据点 (时间, 数值) 均与原始 CSV 同一行同一列的单元格一一对应； 本站不对数值做平滑、插值、重采样或任何数值变换。</p>
  <p><strong>空单元格保留为断点:</strong> CSV 中的空单元格在图中显示为断点。仅在两次相邻有效采样之间按信号类型绘为线段 (连续量) 或阶跃 (离散态)； 不在跨越空单元格的位置绘制任何线条。 这些线段与阶跃仅用于反映已有采样在时间轴上的相对位置， 不代表对采样之间未知数值的任何推断。</p>
  <p><strong>连续 / 离散判定:</strong> 信号的连续或离散属性、以及离散态的显示标签 (如 OFF/ON) 来自 CSV 头部声明的类型字段。 当某列声明为数值 (NUMBER) 但实际取值仅出现于 0/1 中时，本站会启发式地按离散方式呈现并自动推断标签； 此判断仅作用于显示， 不修改任何数值。</p>
  <p><strong>Y 轴可视范围:</strong> 数值型信号的 Y 轴默认按可视时间窗口内的数据自适应缩放；当极端离群值会使主体信号被压扁为接近零的细线时， 自适应范围会回退到该窗口数据的 1%–99% 分位区间，以保持典型信号可读。 此行为仅作用于坐标轴范围， 不修改、不剔除、不替换任何数值； 落在视野外的采样依然完整存在于底层数据中，只是绘制于画布可见范围之外。 如需查看被裁掉的离群值，请以鼠标拖动放大对应时间区间，Y 轴会随可视窗口重新计算。</p>
  <p><strong>原始 FDR 数据本身可能存在的问题:</strong> 传感器噪声或瞬时尖峰；ARINC-573 / 717 子帧多路复用解码导致的位位置串扰与周期性伪值； 量程饱和或哨兵值 (例如 1023、0xFFF0、-1 等) 被读出为貌似正常的读数； 个别采样缺失或长段空白；时间标签轻微错位或子帧不同步等。本站对原始数据中的此类问题 不作识别、不作修正、不作过滤。</p>
  <p><strong>不可单独依赖:</strong> 本页面仅为原始 CSV 数据的可视化呈现， 不构成任何结论、判断或意见。 请勿仅凭本页图形对事故原因、责任、过失或事实作出推断； 如用于正式分析、复现或引用，请以原始 CSV 文件为 唯一权威依据。</p>

  <h3>English</h3>
  <p><strong>Cell-for-cell correspondence.</strong> Every data point (t, y) plotted on this page corresponds one-to-one to a single cell of the original CSV. No smoothing, interpolation, resampling, or numerical transformation is applied to the values.</p>
  <p><strong>Empty cells preserved as gaps.</strong> Empty CSV cells are rendered as gaps. A line segment (continuous signals) or step (discrete signals) is drawn only between two adjacent non-empty samples; no line is ever drawn across an empty cell. Those segments and steps merely indicate the relative position of recorded samples on the time axis and do not represent any inference about values between samples.</p>
  <p><strong>Continuous-vs-discrete classification.</strong> A signal's continuous-or-discrete kind, and the labels used for discrete states (e.g. OFF/ON), are taken from the type declared in the CSV header. When a column is declared NUMBER but its actual values are entirely in 0/1, it is heuristically rendered as discrete with auto-inferred labels; this affects display only and does not modify any values.</p>
  <p><strong>Y-axis viewport.</strong> For numeric signals, the Y-axis range auto-fits to the data within the visible time window. When a small number of extreme outliers would compress the main signal into a near-zero flat line, the range falls back to the 1st–99th percentile of values in that window so the typical trace stays readable. This affects the axis range only; no values are modified, removed, or replaced. Samples outside the visible Y still exist in the underlying data — they simply render beyond the canvas. To inspect clipped outliers, drag-zoom into the relevant time range and the Y-axis will recompute against the new window.</p>
  <p><strong>Underlying-data caveats.</strong> The raw FDR data itself may contain sensor noise and transient spikes; bit-position cross-talk and periodic spurious readings caused by ARINC-573 / 717 subframe multiplex decoding; range saturation or sentinel values (e.g. 1023, 0xFFF0, -1) presented as if they were ordinary readings; individual missing samples or long blank stretches; and slight time-tag misalignment or subframe desynchronization. This site does not detect, correct, or filter such issues.</p>
  <p><strong>Do not rely on this view alone.</strong> This page is purely a visualization of the original CSV and does not constitute any conclusion, finding, or opinion. Do not infer cause, fault, liability, or fact from this view alone. For formal analysis, reproduction, or citation, treat the original CSV file as the sole authoritative source.</p>
</section>

<section id="fdr-app" class="fdr-app" data-csv="../../assets/data/TableResolution.csv">
  <aside class="fdr-sidebar" aria-label="FDR signal selector">
    <input id="fdr-search" class="fdr-search" type="search" placeholder="搜索信号名 / Search signals..." autocomplete="off">
    <div class="fdr-selection-bar">
      <span id="fdr-selected-count">0 / 164 selected</span>
      <button id="fdr-clear" type="button">Clear</button>
    </div>
    <div id="fdr-groups" class="fdr-groups"></div>
  </aside>
  <main class="fdr-main">
    <div class="fdr-toolbar">
      <div>
        <strong>TableResolution.csv</strong>
        <span id="fdr-status">Loading CSV...</span>
      </div>
      <div class="fdr-actions">
        <button id="fdr-reset-zoom" type="button">Reset zoom</button>
        <a href="../../assets/data/TableResolution.csv" download>Download CSV</a>
      </div>
    </div>
    <div id="fdr-charts" class="fdr-charts" aria-live="polite"></div>
  </main>
</section>

<footer class="fdr-source-note">
  灵感和资料来源于：<a href="https://mu5735-foia.com/" target="_blank" rel="noopener">https://mu5735-foia.com/</a>。原作者已授权全部使用。
</footer>

<script src="../../assets/js/fdr-tableresolution.js"></script>
