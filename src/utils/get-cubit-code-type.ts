export enum CubitCode {
    get, post, default, none
}

export default function getCubitCodeType(cubitNameRaw: String): CubitCode {
    if (_endsWithGet(cubitNameRaw)) {
        return CubitCode.get;
    } else if (_endsWithPost(cubitNameRaw)) {
        return CubitCode.post;
    } else {
        return CubitCode.default;
    }
}

function _endsWithGet(name: String): Boolean {
    return name.endsWith('_get');
}

function _endsWithPost(name: String): Boolean {
    return name.endsWith('_post');
}