import * as changeCase from "change-case";
import { BlocType } from "../utils";
import { CubitCode } from "../utils/get-cubit-code-type";

export function getCubitTemplate(cubitName: string, type: BlocType, codeType: CubitCode): string {
  switch (type) {
    case BlocType.Freezed:
      return getFreezedCubitTemplate(cubitName);
    case BlocType.Equatable:
      return getEquatableCubitTemplate(cubitName);
    default:
      return getDefaultCubitTemplate(cubitName, codeType);
  }
}

function getEquatableCubitTemplate(cubitName: string) {
  const pascalCaseCubitName = changeCase.pascalCase(cubitName.toLowerCase());
  const snakeCaseCubitName = changeCase.snakeCase(cubitName.toLowerCase());
  const cubitState = `${pascalCaseCubitName}State`;
  return `import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part '${snakeCaseCubitName}_state.dart';

class ${pascalCaseCubitName}Cubit extends Cubit<${cubitState}> {
  ${pascalCaseCubitName}Cubit() : super(${pascalCaseCubitName}Initial());
}
`;
}

function getDefaultCubitTemplate(cubitName: string, codeType: CubitCode) {
  const pascalCaseCubitName = changeCase.pascalCase(cubitName.toLowerCase());
  const snakeCaseCubitName = changeCase.snakeCase(cubitName.toLowerCase());
  const cubitState = `${pascalCaseCubitName}State`;
  return `import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';

part '${snakeCaseCubitName}_state.dart';

class ${pascalCaseCubitName}Cubit extends Cubit<${cubitState}> {
  ${pascalCaseCubitName}Cubit() : super(${pascalCaseCubitName}Initial());

  ${_createExtraTemplate(pascalCaseCubitName, codeType)}
}
`;
}

export function getFreezedCubitTemplate(cubitName: string) {
  const pascalCaseCubitName = changeCase.pascalCase(cubitName.toLowerCase());
  const snakeCaseCubitName = changeCase.snakeCase(cubitName.toLowerCase());
  const cubitState = `${pascalCaseCubitName}State`;
  return `import 'package:bloc/bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part '${snakeCaseCubitName}_state.dart';
part '${snakeCaseCubitName}_cubit.freezed.dart';

class ${pascalCaseCubitName}Cubit extends Cubit<${cubitState}> {
  ${pascalCaseCubitName}Cubit() : super(${pascalCaseCubitName}State.initial());
}
`;
}

function _createExtraTemplate(cubitName: string, codeType: CubitCode) {
  switch (codeType) {
    case CubitCode.get:
      return _createCodeForGet(cubitName);
    case CubitCode.post:
      return _createCodeForPost(cubitName);
    default:
      return '';
  }
}

function _createCodeForGet(cubitName: string): string {
  return `fetch() async {
  emit(${cubitName}Loading());
  try {
    emit(${cubitName}Loaded());
  } catch (e) {
    emit(${cubitName}Failed("Failed to Load"));
  }
}
  `;
}

function _createCodeForPost(cubitName: string): string {
  return `post() async{
  emit(${cubitName}Loading());
  try {
    emit(${cubitName}Success());
  } catch (e) {
    emit(${cubitName}Failed(e.toString()));
  }
}
  `;
}
