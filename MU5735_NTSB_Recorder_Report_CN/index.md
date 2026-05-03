# NTSB FOIA MU5735

本网站整理了与 MU5735 调查相关的 NTSB FOIA 资料，并提供一份非官方中文译文。

## 内容

- [NTSB 记录器报告中文译文](MU5735_NTSB_Recorder_Report_Chinese.md)
- 原始 PDF、CSV 与其他档案文件保留在 GitHub 仓库中

## NTSB 公开发布资料

NTSB 已在 FOIA Reading Room 公开发布与本仓库相关的资料包：

- 标题：`DCA22WA102 3/21/2022 Wuzhou, China`
- 发布日期：2026-05-01
- 格式：ZIP
- 页数：13
- 大小：326.80 MB
- 说明：`China Eastern Airlines Flight 5735 FOIA Release Records`。NTSB 注明其没有驾驶舱语音记录器（CVR）文字记录；`.upk` 文件需要专用飞行数据记录器（FDR）分析软件读取，即使有相应软件，也仍需要制造商专有文档才能解释数据。

资料入口：

- [NTSB FOIA Reading Room](https://securefoia.ntsb.gov/app/ReadingRoom.aspx)
- [NTSB 资料包直连](https://securefoia.ntsb.gov/app/AddAttachment.aspx?docid=66&ispaldoc=F)
- [Internet Archive 备份](https://web.archive.org/web/20260502141354/https://securefoia.ntsb.gov/app/AddAttachment.aspx?docid=66&ispaldoc=F)
- [GitHub issue #14 讨论来源](https://github.com/wrongly-cuddly-obsession/NTSB_FOIA_MU5735/issues/14)

## 事故时间线与数据局限

以下内容整理自社区基于 NTSB FOIA 公开资料（DCA22WA102）所作的时间线汇总，仅用于帮助理解公开资料中的事件顺序和数据边界。

### 可用数据

| 数据类型 | 来源 | 状态 |
| --- | --- | --- |
| FDR 飞行数据 | `ExactSample.csv` / `TableResolution.csv` | 最后 12 分 57 秒，部分缺失 |
| CVR 驾驶舱语音 | NTSB 恢复后移交 CAAC | 四通道均为“优秀”质量；NTSB 未保留副本 |
| FDR 原始二进制流 | `12minute.upk` | 可用，但需专业 FDR 分析软件和制造商专有文档解码 |
| NTSB 记录器报告 | FOIA 公开资料 | 已公开，本站提供非官方中文译文 |

### 可确认事件顺序

1. 飞机在约 29,000 英尺巡航时，双发燃油开关从 `RUN` 切换到 `CUTOFF`。
2. 燃油切断是 FDR 记录到的最早异常事件；据 NTSB 报告和 FDR 数据，切断前飞机各系统未见异常。
3. 燃油切断后，两台发动机转速下降。
4. 当发动机 N2 转速降至约 26% 时，发电机脱网，FDR 失去供电。
5. FDR 在飞机仍处于约 26,000 英尺下降过程中停止记录，因此之后的下降和最终事故过程没有 FDR 数据。
6. CVR 因具备电池备份继续记录，恢复后的四个通道音频质量均为“优秀”。
7. NTSB 将全部 CVR 数据移交 CAAC，NTSB 自身未保留任何 CVR 音频文件或可生成音频文件的原始、中间下载数据。

### FDR 伪信号说明

FDR 数据中出现的部分 `FIRE`、`EGT = 1023`、`APU ON` 等异常值，被社区汇总解释为 U2 芯片缺失造成的伪信号，不应直接视为真实飞机状态。识别这类错误帧时，可参考以下特征：

- 具有约 8 秒周期，对应约 6.5 秒有效数据加约 1.3 秒 U2 缺失区间。
- 多个参数会同时跳变到不可能或极端值，例如 `Altitude Press = -1`、`Airspeed Comp = 511.75`、`Ground Speed = 1023.5`、`Eng EGT = 1023`、`Eng Fire = FIRE`、`Eng N1 = 127.88`、`Fuel Flow = 16368`、`APU On = ON`、`Cutoff SW = CUTOFF`。
- 异常值通常瞬间跳变后立即恢复，不伴随连续、物理合理的飞行状态变化。

相对而言，真实事件通常不落在固定的 8 秒错误帧周期上，且会伴随物理合理、持续的参数变化，并与 NTSB 报告正文描述一致。

### 调查披露边界

NTSB 是本次调查的被认可代表，调查主导权在 CAAC。根据双方协议，NTSB 不得在未经 CAAC 同意的情况下披露调查进展和发现。

来源：[GitHub issue #12 时间线汇总](https://github.com/wrongly-cuddly-obsession/NTSB_FOIA_MU5735/issues/12)

## 第三方可视化项目

以下项目为社区成员基于公开资料制作的非官方模拟或三维重建，仅作直观参考，不代表 NTSB、CAAC 或本仓库的调查结论。

- [MU5735 Simulation Replay](https://mu5735.colorcard.cc)：基于 MU5735 公开 ADS-B 记录与 FOIA 公布的 FDR 导出数据，构建 ADS-B + FDR 融合数据到 Web 端的最后 2 分钟模拟回放。其说明称，主时间轴以 ADS-B Reveal 末条记录为基准向前回溯 120 秒，其中窗口前约 26.8 秒与 FDR 有限重叠；后段进入纯 ADS-B 区间，因此姿态、操纵、发动机等 FDR 专属量只在重叠段内可见，后段仅保留 ADS-B 可支撑的外部运动信息和严格派生量。项目仓库：[colorcard/MU5735-Simulation-Replay](https://github.com/colorcard/MU5735-Simulation-Replay)。
- [MU5735 三维飞行重建 Demo](https://djzoom.github.io/MU5735/)：社区成员制作的三维飞行重建参考项目。项目仓库：[djzoom/MU5735](https://github.com/djzoom/MU5735)。

来源：[GitHub issue #13 讨论](https://github.com/wrongly-cuddly-obsession/NTSB_FOIA_MU5735/issues/13)

## 声明

中文译文仅供参考，原始英文资料是唯一权威来源。译文可能包含错误或不准确之处。

## 仓库

[查看 GitHub 仓库](https://github.com/adminlby/NTSB_FOIA_MU5735)
