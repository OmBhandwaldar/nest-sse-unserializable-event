# `@Sse()` stream hangs silently when event data can't be serialized

Minimal reproduction for NestJS: when an `@Sse()` event's `data` can't be serialized (a `BigInt`,
a circular reference, or a number), the stream stops sending events, the response never ends,
and nothing is logged.

Tested with `@nestjs/core` 12.1.2 (also reproduces on 11.2.7), Node.js 24.16.0, macOS.

```sh
npm install
npm start
```

In another terminal:

```sh
curl -N --max-time 3 http://localhost:3000/sse
curl -i --max-time 3 http://localhost:3000/sse-first
curl -N --max-time 3 http://localhost:3000/sse-number
```

`curl` only exits because of `--max-time` (exit code 28): the server never ends the response.

| Route | What it emits | Actual | Expected |
|---|---|---|---|
| `/sse` | `{ n: 1 }`, then `{ n: 2n }` (a `BigInt`, e.g. a Prisma `BigInt` column), then `{ n: 3 }` | event 1, then nothing; event 3 never arrives | event 1, then an `event: error` and the end of the response, as for any other error once the stream has started |
| `/sse-first` | `{ n: 1n }` as the first event | `200`, SSE headers, no events | a 500 through the exception filters, like an observable that errors before the first event |
| `/sse-number` | `{ data: 1 }`, then `{ data: 'two' }` (a plain `of(1, 2)` behaves the same) | `200`, no events | `data: 1`, then `data: two` |

Same result with `FastifyAdapter`.
