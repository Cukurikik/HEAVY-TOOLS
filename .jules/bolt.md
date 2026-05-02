## 2024-05-18 - [Cron Job Cleanup Performance]
**Learning:** Using sequential `await`s inside a `for` loop for network-bound cloud storage deletion and database bulk record deletion results in an N+1 query and severe sequential I/O bottlenecks.
**Action:** Chunk network operations with `Promise.allSettled` to fetch multiple resources concurrently, and consolidate subsequent operations (like `db.deleteMany`) inside a chunk to heavily optimize response times.
