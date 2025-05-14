export class PaginationCursor {
  static encode(payload): string {
    return Buffer.from(
      JSON.stringify(payload),
      'utf8',
    ).toString('base64');
  }

  static decode(cursor: string) {
    return JSON.parse(
      Buffer.from(cursor, 'base64').toString(),
    );
  }
}
