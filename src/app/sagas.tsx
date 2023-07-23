import { all } from 'redux-saga/effects';
import watchErrorSagas from "../features/error/errorSagas";


export default function* rootSaga() {
    yield all([
        watchErrorSagas(),
    ]);
}