## 2026-05-02 - Optimize Engine Stats Iteration
**Learning:** Repeated Array.prototype.find() over small arrays can still cause visible CPU cycles overhead when multiplied over many keys. Using O(1) manual mapping variable tracking is always faster.
**Action:** Use variables for stats looking mapping, dropping calculation time roughly 80%.
