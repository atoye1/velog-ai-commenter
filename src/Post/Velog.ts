import axios from "axios";
import { LocalDB } from "../localDB/localDB";
import * as cheerio from "cheerio";

const fetchData = async (uri:string) => {
    try {
      const response = await axios.get(uri);
      const data = response.data;
      // Process the data or perform any additional operations
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

export class Velog {
  public uri:string;
  public html:string;
  public $ ;
  private db:LocalDB

  constructor(targetBlog: string, db: LocalDB) {
    this.uri = `https://velog.io/@${targetBlog}`;
    this.html = await fetchData(this.uri);
    this.$ = cheerio.load(this.html);
    this.db = db
  }

  get title():string {
    return this.html;
  }

  get body():string {
    return this.html;
  }

  get tags(): string[] {
    return [this.html]
  }

  const extractedTags = $("a")
    .filter(function () {
      const href = $(this).attr("href");
      return href.includes("/@atoye1/");
    })
    .map(function (elem) {
      return $(this).attr("href");
    })
    .toArray();
  console.log(extractedTags);
}
