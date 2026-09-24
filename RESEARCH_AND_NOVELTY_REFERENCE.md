# Related Work & Novelty Positioning — SIH26139 (Egreen Quanta)

This note documents where QureML's core empirical contribution sits relative to prior published work, as of September 2026.

## Positioning

QureML's central empirical question is whether a hybrid quantum-classical model earns a genuine advantage over a parameter-matched classical baseline on small, real biomedical datasets — evaluated with multi-seed statistical testing, an entanglement-ablated control, an untrained-circuit control, and validation on real IBM quantum hardware.

This question is being actively studied in 2026, and several recent papers report closely related negative or null findings:

- J. Bowles, S. Ahmed, M. Schuld, "Better than classical? The subtle art of benchmarking quantum machine learning models," arXiv:2403.07059 (2024). Tests 12 QML models across 6 binary tasks (160 datasets); finds classical models generally outperform, and that removing entanglement often does not hurt performance.
- C. Yu et al., "Quantum vs. Classical Machine Learning: A Unified Empirical Comparison," arXiv:2607.01197 (2026). Seven parameter-matched, seed-fixed model pairs; concludes QML does not yet surpass classical baselines on the tasks tested.
- Rubiños Rodríguez et al., arXiv:2607.21186 (2026). Multi-seed (10 seeds), parameter-matched, entanglement-ablated comparison on two real medical-imaging datasets (retinal OCT, dementia MRI); the closest prior work to QureML's angle, though its quantum component is classically emulated rather than hardware-validated, and its parameter-matching is self-described as imperfect.
- Leither et al., arXiv:2608.11373 (Aug 2026). Oncology benchmark across tabular, omics, and spatial cancer data with AutoML-matched classical baselines; reports no evidence of quantum advantage.
- Gonaygunta, *Informatics* 13(6):98 (2026). WDBC, 5-fold cross-validated, Holm-Bonferroni corrected, 441-parameter-matched MLP vs. HQCNN; reports the hybrid model is competitive with, not significantly superior to, the classical baseline.
- Large-scale quantum-kernel benchmark, arXiv:2604.18837. 16 seeds, 8,400 SVM fits, 29 pairwise quantum-vs-classical comparisons; zero reach statistical significance at α=0.05, with a factorial analysis attributing most performance variance to dataset choice rather than kernel type.

QureML's contribution combines three elements that, together, are not fully covered by any single one of the above: (1) real IBM quantum hardware validation rather than simulation only, (2) a fixed/untrained-circuit control isolating whether training the quantum layer matters at all, in addition to the standard classical and entanglement-ablated controls, and (3) formal multi-seed statistical testing (Wilcoxon signed-rank / paired t-test, Holm-Bonferroni corrected) across three real clinical datasets rather than one.

## Supporting background results (independently verified)

- **Barren plateaus in QCNNs are not novel.** A. Pesah, M. Cerezo, S. Wang, T. Volkoff, A. T. Sornborger, P. J. Coles, "Absence of Barren Plateaus in Quantum Convolutional Neural Networks," *Physical Review X* 11, 041011 (2021). An established, heavily cited result (≈400+ citations as of Sept 2026); not claimed as a QureML contribution.
- **The QML weak-baseline problem is well documented**, per Bowles et al. (2024) and Yu et al. (2026) above — both find that many prior QML papers understated or omitted proper classical baselines.
- **Engineered quantum advantage exists and was reproduced.** Y. Liu, S. Arunachalam, K. Temme, "A rigorous and robust quantum speed-up in supervised machine learning," *Nature Physics* 17(9):1013–1017 (2021). QureML reproduces this discrete-logarithm-based separation on a 6-qubit register across a 10-seed sweep (quantum kernel SVM: 95.56% ± 3.33% test accuracy vs. classical RBF SVM: 47.22% ± 9.04%; paired Wilcoxon p = 0.00195), confirming the quantum pipeline is functional and correctly recovers advantage when the underlying data has the group-theoretic structure that predicts one — which clinical tabular data does not.
- **Clinical Decision Curve Analysis.** A. J. Vickers, E. B. Elkin, "Decision Curve Analysis: A Novel Method for Evaluating Prediction Models," *Medical Decision Making* 26(6):565–574 (2006). Applied to QureML's locked WDBC test cohort: both the hybrid and classical models achieve substantial net clinical benefit across plausible decision thresholds, with near-identical net benefit between them (Δ = +0.0023 at p_t = 0.10).
- **Selective classification / referral triage.** R. El-Yaniv, Y. Wiener, "On the Foundations of Noise-free Selective Classification," *JMLR* 11:1605–1641 (2010). Applied to QureML: abstaining on the 10% most ambiguous cases (via quantum measurement-uncertainty width) raises accepted-case accuracy to 100% on the locked WDBC test cohort.

## Caveats

- Citation counts (e.g. for Pesah et al.) are Semantic Scholar figures as of September 2026 and should be treated as a floor.
- Dataset/method details for arXiv preprints not yet peer-reviewed (Rubiños Rodríguez et al., Leither et al., the 8,400-fit benchmark) are drawn from their abstracts and available preprint text as of September 2026.
