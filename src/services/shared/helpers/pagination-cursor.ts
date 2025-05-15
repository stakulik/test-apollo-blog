import { CursorPayload } from '../../typings';

export class PaginationCursor {
  static encode(payload): string {
    return Buffer.from(
      JSON.stringify(payload),
      'utf8',
    ).toString('base64');
  }

  static decode(cursor: string): CursorPayload {
    return JSON.parse(
      Buffer.from(cursor, 'base64').toString(),
    );
  }
}
