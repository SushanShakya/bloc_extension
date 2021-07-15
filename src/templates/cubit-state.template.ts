import * as changeCase from "change-case";
import { BlocType } from "../utils";
import { CubitCode } from "../utils/get-cubit-code-type";

export function getCubitStateTemplate(
  cubitName: string,
  type: BlocType,
  codeType: CubitCode
): string {
  switch (type) {
    case BlocType.Freezed:
      return getFreezedCubitStateTemplate(cubitName);
    case BlocType.Equatable:
      return getEquatableCubitStateTemplate(cubitName);
    default:
      return getDefaultCubitStateTemplate(cubitName, codeType);
  }
}

function getEquatableCubitStateTemplate(cubitName: string): string {
  const pascalCaseCubitName = changeCase.pascalCase(cubitName.toLowerCase());
  const snakeCaseCubitName = changeCase.snakeCase(cubitName.toLowerCase());
  return `part of '${snakeCaseCubitName}_cubit.dart';

abstract class ${pascalCaseCubitName}State extends Equatable {
  const ${pascalCaseCubitName}State();

  @override
  List<Object> get props => [];
}

class ${pascalCaseCubitName}Initial extends ${pascalCaseCubitName}State {}
`;
}

function getDefaultCubitStateTemplate(cubitName: string, codeType: CubitCode): string {
  const pascalCaseCubitName = changeCase.pascalCase(cubitName.toLowerCase());
  const snakeCaseCubitName = changeCase.snakeCase(cubitName.toLowerCase());
  return `part of '${snakeCaseCubitName}_cubit.dart';

@immutable
abstract class ${pascalCaseCubitName}State {}

class ${pascalCaseCubitName}Initial extends ${pascalCaseCubitName}State {}

${_getExtraTemplate(pascalCaseCubitName, codeType)}
`;
}

function getFreezedCubitStateTemplate(cubitName: string): string {
  const pascalCaseCubitName = changeCase.pascalCase(cubitName.toLowerCase());
  const snakeCaseCubitName = changeCase.snakeCase(cubitName.toLowerCase());
  return `part of '${snakeCaseCubitName}_cubit.dart';

@freezed
abstract class ${pascalCaseCubitName}State with _\$${pascalCaseCubitName}State {
  const factory ${pascalCaseCubitName}State.initial() = _Initial;
}
`;
}

function _getExtraTemplate(cubitName: string, codeType: CubitCode) {
  switch (codeType) {
    case CubitCode.get:
      return _getGetTemplateExtras(cubitName);
    case CubitCode.post:
      return _getPostTemplateExtras(cubitName);
    default:
      return '';
  }
}

function _getPostTemplateExtras(cubitName: string) {
  return `class ${cubitName}Loading extends ${cubitName}State {}

class ${cubitName}Success extends ${cubitName}State {}

class ${cubitName}Failed extends ${cubitName}State {
  final String message;

  ${cubitName}Failed(this.message);

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ${cubitName}Failed && other.message == message;
  }

  @override
  int get hashCode => message.hashCode;
}
  `;
}

function _getGetTemplateExtras(cubitName: string) {
  return `class ${cubitName}Loading extends ${cubitName}State {}

class ${cubitName}Loaded extends ${cubitName}State {}

class ${cubitName}Failed extends ${cubitName}State {
  final String message;

  ${cubitName}Failed(this.message);

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is ${cubitName}Failed && other.message == message;
  }

  @override
  int get hashCode => message.hashCode;
}
  `;
}
