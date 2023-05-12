import { Blog } from "./Blog";
import axios from "axios";
import * as cheerio from "cheerio";

export class Velog extends Blog {
  public postUris: Set<string>;
  public blogUri: string = "";
  private urlPrefix = "https://velog.io/@";

  constructor(public velogId: string) {
    super();
    this.blogUri = this.urlPrefix + velogId;
    this.postUris = new Set();
  }

  async scrapPosts(): Promise<void> {
    const html = (await axios.get(this.blogUri)).data;
    const $ = cheerio.load(html);
    const selectedTags = $(`a[href*="${this.velogId}/"]`);
    const postsUris: string[] = [];
    const promises: Promise<void>[] = [];

    // TODO : bug exits
    selectedTags.each((idx, elem) => {
      const tag = $(elem);
      const link = tag.attr("href");
      console.log("links", link);
      if (
        link &&
        link !== `/@${this.velogId}/series` &&
        link !== `/@${this.velogId}/about`
      ) {
        promises.push(
          new Promise<void>((resolve) => {
            postsUris.push(link);
            resolve();
          })
        );
      }
    });
    await Promise.all(promises);
    this.postUris = new Set(postsUris.map((elem) => "https://velog.io" + elem));
  }
}
