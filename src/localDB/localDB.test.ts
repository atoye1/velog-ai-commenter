import fs from "fs";
import path from "path";
import { LocalDB } from "./localDB";

describe("LocalDB class test suites", () => {
  let localDB: LocalDB;
  const basepath = path.resolve(__dirname, "..", "DB.json");

  describe("File path Test", () => {
    it("should be initialized with basepath when no path provided with", () => {
      localDB = new LocalDB();
      expect(localDB.filepath).toBe(basepath);
    });

    it("should be initialized with provided path", () => {
      const testPath = __dirname + "/test.json";
      fs.writeFileSync(testPath, JSON.stringify({ id1: {} }));
      localDB = new LocalDB(testPath);
      expect(localDB.filepath).toBe(testPath);
      fs.unlinkSync(testPath);
    });
  });

  describe("checkCommented Test", () => {
    const testPath = __dirname + "/test.json";
    beforeEach(() => {
      fs.writeFileSync(
        testPath,
        JSON.stringify({
          id1: { isCommented: false },
          id2: { isCommented: true },
        })
      );
      localDB = new LocalDB(testPath);
    });

    afterEach(() => {
      fs.unlinkSync(testPath);
    });

    it("should return correct value for existing post", () => {
      expect(localDB.checkCommented("id1")).toBe(false);
      localDB.setCommented("id1");
      expect(localDB.checkCommented("id1")).toBe(true);
    });

    it("should throw error for not existing post", () => {
      expect(() => {
        localDB.checkCommented("WrongKey");
      }).toThrow();
    });
  });

  describe("setCommented Test", () => {
    const testPath = __dirname + "/test.json";
    beforeEach(() => {
      fs.writeFileSync(
        testPath,
        JSON.stringify({
          id1: { isCommented: false },
          id2: { isCommented: true },
        })
      );
      localDB = new LocalDB(testPath);
    });

    afterEach(() => {
      fs.unlinkSync(testPath);
    });

    it("should set comment for specified data", () => {
      expect(localDB.checkCommented("id1")).toBe(false);
      localDB.setCommented("id1");
      expect(localDB.checkCommented("id1")).toBe(true);
    });

    it("should throw error for not existing post", () => {
      expect(() => {
        localDB.checkCommented("WrongKey");
      }).toThrow();
    });
  });

  describe("checkExist Test", () => {
    const testPath = __dirname + "/test.json";
    beforeEach(() => {
      fs.writeFileSync(
        testPath,
        JSON.stringify({
          id1: { isCommented: false },
          id2: { isCommented: true },
        })
      );
      localDB = new LocalDB(testPath);
    });

    afterEach(() => {
      fs.unlinkSync(testPath);
    });

    it("should return true if key exist", () => {
      expect(localDB.checkExist("id1")).toBe(true);
    });

    it("should return false if key not exist", () => {
      expect(localDB.checkExist("id")).toBe(false);
    });
  });

  describe("insertDB Test", () => {
    const testPath = __dirname + "/test.json";
    beforeEach(() => {
      fs.writeFileSync(
        testPath,
        JSON.stringify({
          id1: { isCommented: false },
          id2: { isCommented: true },
        })
      );
      localDB = new LocalDB(testPath);
    });

    afterEach(() => {
      fs.unlinkSync(testPath);
    });

    it("should insert data to file correclty", () => {
      const targetId = "id1";
      const targetData = {
        title: "id1 insert title",
        isCommented: true,
        uri: "http:www.naver.com",
      };
      localDB.insertDB(targetId, targetData);
      expect(localDB.data[targetId]).toStrictEqual(targetData);
      const fileData = JSON.parse(fs.readFileSync(testPath, "utf-8"));
      expect(fileData[targetId]).toStrictEqual(targetData);
    });
  });
});
