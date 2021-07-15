import * as _ from "lodash";
import * as changeCase from "change-case";
import * as mkdirp from "mkdirp";

import { InputBoxOptions, OpenDialogOptions, Uri, window } from "vscode";
import { existsSync, lstatSync, writeFile, mkdirSync } from "fs";
import { getCubitStateTemplate, getCubitTemplate } from "../templates";
import { getBlocType, BlocType, TemplateType } from "../utils";

import getCubitCodeType, { CubitCode } from "../utils/get-cubit-code-type";

export const newCubit = async (uri: Uri) => {
  const cubitNameRaw = await promptForCubitName();

  if (_.isNil(cubitNameRaw) || cubitNameRaw.trim() === "") {
    window.showErrorMessage("The cubit name must not be empty");
    return;
  }

  let targetDirectory;
  if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
    targetDirectory = await promptForTargetDirectory();
    if (_.isNil(targetDirectory)) {
      window.showErrorMessage("Please select a valid directory");
      return;
    }
  } else {
    targetDirectory = uri.fsPath;
  }

  const cubitCodeType = getCubitCodeType(cubitNameRaw);

  const cubitName = _getCubitName(cubitNameRaw, cubitCodeType);

  const blocType = await getBlocType(TemplateType.Cubit);
  const pascalCaseCubitName = changeCase.pascalCase(cubitName.toLowerCase());
  try {
    await generateCubitCode(cubitName, targetDirectory, blocType, cubitCodeType);
    window.showInformationMessage(
      `Successfully Generated ${pascalCaseCubitName} Cubit`
    );
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

function promptForCubitName(): Thenable<string | undefined> {
  const cubitNamePromptOptions: InputBoxOptions = {
    prompt: "Cubit Name",
    placeHolder: "counter",
  };
  return window.showInputBox(cubitNamePromptOptions);
}

async function promptForTargetDirectory(): Promise<string | undefined> {
  const options: OpenDialogOptions = {
    canSelectMany: false,
    openLabel: "Select a folder to create the cubit in",
    canSelectFolders: true,
  };

  return window.showOpenDialog(options).then((uri) => {
    if (_.isNil(uri) || _.isEmpty(uri)) {
      return undefined;
    }
    return uri[0].fsPath;
  });
}

async function generateCubitCode(
  cubitName: string,
  targetDirectory: string,
  type: BlocType,
  codeType: CubitCode
) {
  const cubitDirectoryPath = `${targetDirectory}/cubit`;
  if (!existsSync(cubitDirectoryPath)) {
    await createDirectory(cubitDirectoryPath);
  }

  await Promise.all([
    createCubitStateTemplate(cubitName, targetDirectory, type, codeType),
    createCubitTemplate(cubitName, targetDirectory, type, codeType),
  ]);
}

function createDirectory(targetDirectory: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirp(targetDirectory, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

function createCubitStateTemplate(
  cubitName: string,
  targetDirectory: string,
  type: BlocType,
  codeType: CubitCode
) {
  const snakeCaseCubitName = changeCase.snakeCase(cubitName.toLowerCase());
  const targetFolder = `${targetDirectory}/${snakeCaseCubitName}`;
  const targetPath = `${targetFolder}/${snakeCaseCubitName}_state.dart`;
  if (existsSync(targetPath)) {
    throw Error(`${snakeCaseCubitName}_state.dart already exists`);
  }
  if (!existsSync(targetFolder)) {
    mkdirSync(targetFolder);
  }
  return new Promise(async (resolve, reject) => {
    writeFile(
      targetPath,
      getCubitStateTemplate(cubitName, type, codeType),
      { flag: "w+" },
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(null);
      }
    );
  });
}

function createCubitTemplate(
  cubitName: string,
  targetDirectory: string,
  type: BlocType,
  codeType: CubitCode
) {
  const snakeCaseCubitName = changeCase.snakeCase(cubitName.toLowerCase());
  const targetFolder = `${targetDirectory}/${snakeCaseCubitName}`;
  const targetPath = `${targetFolder}/${snakeCaseCubitName}_cubit.dart`;
  if (existsSync(targetPath)) {
    throw Error(`${snakeCaseCubitName}_cubit.dart already exists`);
  }
  if (!existsSync(targetFolder)) {
    mkdirSync(targetFolder);
  }
  return new Promise(async (resolve, reject) => {
    writeFile(
      targetPath,
      getCubitTemplate(cubitName, type, codeType),
      { flag: "w+" },
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(null);
      }
    );
  });
}

function _getCubitName(rawName: string, codeType: CubitCode): string {
  switch (codeType) {
    case CubitCode.get:
      return rawName.replace('_get', '');
    case CubitCode.post:
      return rawName.replace('_post', '');
    default:
      return rawName;
  }
}
