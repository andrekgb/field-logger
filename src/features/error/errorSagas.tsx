import {call, takeLatest} from 'redux-saga/effects';
import {PayloadAction} from "@reduxjs/toolkit";
import router from "../../routes/router";

function* displayError() {
    try {
        yield call(router.navigate, '/error');
    }
    catch (e) {
        console.log('errorSagas.displayError',e);
    }
};

function* errorSagaHandler(action: PayloadAction<any>) {
    switch (action.type) {
        case 'error/displayError':
            yield call(displayError);
    }
}

export default function* watchErrorSagas() {
    yield takeLatest([
        'error/displayError'
    ], errorSagaHandler);
};