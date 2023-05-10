import fs from "fs";
import path from "path";

export interface VelogPostMetadata {
  uri: string;
  title: string;
  isCommented: boolean;
}

export class LocalDB {
  data: { [id: string]: VelogPostMetadata } = {};
  filepath: string = path.resolve(__dirname, "..", "DB.json");

  constructor(filepath?: string) {
    if (filepath) {
      this.filepath = filepath;
    }
    this.data = JSON.parse(fs.readFileSync(this.filepath, "utf-8"));
  }

  setCommented(id: string): void {
    const target = this.data[id];
    if (!target) throw new Error("target not exists");
    this.data[id].isCommented = true;
    this.updateFile();
  }

  insertDB(id: string, data: VelogPostMetadata): void {
    this.data[id] = data;
    this.updateFile();
  }

  checkExist(id: string): boolean {
    return !!this.data[id];
  }

  checkCommented(id: string): boolean {
    const target = this.data[id];
    if (!target) throw new Error("target not exists");
    return this.data[id].isCommented;
  }

  private updateFile(): void {
    fs.writeFileSync(this.filepath, JSON.stringify(this.data));
  }
}
