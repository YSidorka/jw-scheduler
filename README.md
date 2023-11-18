### Job Worker

_version 1.0.0_

@jw/scheduler

---

Job worker scheduler based on worker threads

### Worker object

```json
{
  "_id": String,
  "type": "worker",
  "active": Boolean,
  "data": {
    "title": String,
    "path": "worker.js",
    "env": Object,
    "cronexp": CronExp
  }
}
```

#### CronExp

```
 ┌────────────── second (optional) 0-59
 │ ┌──────────── minute            0-59
 │ │ ┌────────── hour              0-23
 │ │ │ ┌──────── day of month      1-31
 │ │ │ │ ┌────── month             1-12
 │ │ │ │ │ ┌──── day of week       0-7
 * * * * * *
```

#### Env. sample

```json
# DATA_STORAGE
{
  "type":"mongodb",
  "dbUrl":"mongodb://127.0.0.1:27017/",
  "dbName":"workers"
}
```
