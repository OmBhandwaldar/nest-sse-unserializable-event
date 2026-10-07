import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Controller()
export class AppController {
  // Emits a serializable event, then one with a BigInt (e.g. a Prisma BigInt
  // column), then another serializable event, then completes.
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return new Observable(subscriber => {
      subscriber.next({ data: { n: 1 } });
      setTimeout(() => subscriber.next({ data: { n: 2n } }), 100);
      setTimeout(() => subscriber.next({ data: { n: 3 } }), 200);
      setTimeout(() => subscriber.complete(), 300);
    });
  }

  // Same, but the first event already can't be serialized.
  @Sse('sse-first')
  sseFirst(): Observable<MessageEvent> {
    return new Observable(subscriber => {
      subscriber.next({ data: { n: 1n } });
      setTimeout(() => subscriber.complete(), 100);
    });
  }

  // Number data, a plain `of(1, 2)` gives the same result.
  @Sse('sse-number')
  sseNumber(): Observable<MessageEvent> {
    return of({ data: 1 } as unknown as MessageEvent, { data: 'two' });
  }
}
