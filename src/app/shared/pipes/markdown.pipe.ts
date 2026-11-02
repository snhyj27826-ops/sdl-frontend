import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';

/** Converts Markdown to HTML. Bind the result to `[innerHTML]` so Angular sanitizes it. */
@Pipe({ name: 'markdown', standalone: true })
export class MarkdownPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return value ? (marked.parse(value, { async: false, gfm: true, breaks: true }) as string) : '';
  }
}
