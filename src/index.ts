import fs from "fs";
import path from "path";
import fileExists from "file-exists";
import userHome from "user-home";
import merge from "lodash.merge";

type ContextProps<T = {}> = { settingFilename: string; defaultSettings: T };

export default class Context<T> {
  absoluteFilename: string;
  cache: any;

  constructor({ settingFilename, defaultSettings }: ContextProps<T>) {
    const absoluteFilename = (this.absoluteFilename = path.resolve(userHome, settingFilename));
    let fileContent = {};

    if (fileExists.sync(absoluteFilename)) {
      const jsonData = fs.readFileSync(absoluteFilename, { encoding: "utf8" });

      try {
        fileContent = JSON.parse(jsonData);
      } catch (err) {
        // todo
      }
    }

    this.write(merge({}, defaultSettings, fileContent));
  }

  read(): T {
    return this.cache;
  }

  write(data: T): void {
    const content = { ...this.cache, ...data };

    fs.writeFileSync(this.absoluteFilename, JSON.stringify(content, null, 2), {
      encoding: "utf8"
    });

    this.cache = merge({}, content);
  }
}
