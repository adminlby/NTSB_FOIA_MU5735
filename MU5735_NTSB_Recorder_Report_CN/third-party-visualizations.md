# 第三方项目

以下项目为社区成员基于公开资料制作的非官方模拟或三维重建，仅作直观参考，不代表 NTSB、CAAC 或本仓库的调查结论。

- [MU5735 Simulation Replay](https://mu5735.colorcard.cc)：基于 MU5735 公开 ADS-B 记录与 FOIA 公布的 FDR 导出数据，构建 ADS-B + FDR 融合数据到 Web 端的最后 2 分钟模拟回放。其说明称，主时间轴以 ADS-B Reveal 末条记录为基准向前回溯 120 秒，其中窗口前约 26.8 秒与 FDR 有限重叠；后段进入纯 ADS-B 区间，因此姿态、操纵、发动机等 FDR 专属量只在重叠段内可见，后段仅保留 ADS-B 可支撑的外部运动信息和严格派生量。项目仓库：[colorcard/MU5735-Simulation-Replay](https://github.com/colorcard/MU5735-Simulation-Replay)。
- [MU5735 三维飞行重建 Demo](https://djzoom.github.io/MU5735/)：社区成员制作的三维飞行重建参考项目。项目仓库：[djzoom/MU5735](https://github.com/djzoom/MU5735)。

来源：[GitHub issue #13 讨论](https://github.com/wrongly-cuddly-obsession/NTSB_FOIA_MU5735/issues/13)
