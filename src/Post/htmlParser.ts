import * as cheerio from "cheerio";
import TurnDownService from "turndown";
import { IPostData } from "./IPostData";

export class HtmlParser {
  static getPostData(uri: string, html: string): IPostData {
    const $ = cheerio.load(html);

    function extractPostId($: cheerio.Root): string {
      const scriptText = $("script").text();
      const re = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/;
      const result = re.exec(scriptText);
      if (result) return result[0];
      throw new Error("Post id not found");
    }

    function extractTitle($: cheerio.Root): string {
      const $title = $("head title");
      return $title.text();
    }

    function extractContent($: cheerio.Root): string {
      const contentHtml = $("div.atom-one").html()!;
      const turndownService = new TurnDownService();
      const content = turndownService.turndown(contentHtml);
      return content;
    }

    function extractTags($: cheerio.Root): string[] {
      const tags: string[] = [];
      $("a[href*='tags']").map((_, elem) => {
        tags.push($(elem).text());
      });
      return tags;
    }

    return {
      post_id: extractPostId($),
      title: extractTitle($),
      content: extractContent($),
      uri: uri,
      tags: extractTags($),
    };
  }
}
