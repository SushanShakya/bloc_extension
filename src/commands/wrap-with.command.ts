import { wrapWith } from "../utils";

const blocBuilderSnippet = (widget: string) => {
  return `BlocBuilder<\${1:Subject}\${2|Cubit,Bloc|}, $1State>(
  builder: (context, state) {
    if(state is $1Failed) {
      return ErrorOutput(message: state.message);
    }
    if(state is $1Loaded) {
      return ${widget};  
    }
    return Loading();
  },
)`;
};

const blocListenerSnippet = (widget: string) => {
  return `BlocListener<\${1:Subject}\${2|Cubit,Bloc|}, $1State>(
  listener: (context, state) {
    if(state is $1Loading) {
      showLoadingDialog(context);
      return;
    }
    Navigator.of(context, rootNavigator: true).pop();
    if(state is $1Failed) {
      showErrorDialog(context);
    }
    if(state is $1Success) {
      showSuccessDialog(context);
    }
  },
  child: ${widget},
)`;
};

const blocProviderSnippet = (widget: string) => {
  return `BlocProvider(
  create: (context) => \${1:Subject}\${2|Cubit,Bloc|}(),
  child: ${widget},
)`;
};

const blocConsumerSnippet = (widget: string) => {
  return `BlocConsumer<\${1:Subject}\${2|Cubit,Bloc|}, $1State>(
  listener: (context, state) {
    \${3:// TODO: implement listener}
  },
  builder: (context, state) {
    return ${widget};
  },
)`;
};

const repositoryProviderSnippet = (widget: string) => {
  return `RepositoryProvider(
  create: (context) => \${1:Subject}Repository(),
    child: ${widget},
)`;
};

export const wrapWithBlocBuilder = async () => wrapWith(blocBuilderSnippet);
export const wrapWithBlocListener = async () => wrapWith(blocListenerSnippet);
export const wrapWithBlocConsumer = async () => wrapWith(blocConsumerSnippet);
export const wrapWithBlocProvider = async () => wrapWith(blocProviderSnippet);
export const wrapWithRepositoryProvider = async () =>
  wrapWith(repositoryProviderSnippet);
