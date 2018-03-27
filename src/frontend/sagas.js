import "regenerator-runtime/runtime"
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import rest from 'rest'
import mime from 'rest/interceptor/mime';
import location from 'rest/interceptor/location';
//import { mime, location } from 'rest/interceptor';

function* fetchCountries(action) {
   try {
      const response = yield call(rest.wrap(mime), '/common/countries');
      yield put({type: "COUNTRIES_FETCH_SUCCEEDED", countries: response.entity });
   } catch (e) {
      yield put({type: "COUNTRIES_FETCH_FAILED", message: e.message});
   }
}

function* fetchCurrencies(action) {
   try {
      const response = yield call(rest.wrap(mime), '/common/currencies');
      yield put({type: "CURRENCIES_FETCH_SUCCEEDED", currencies: response.entity });
   } catch (e) {
      yield put({type: "CURRENCIES_FETCH_FAILED", message: e.message});
   }
}

// worker Saga: will be fired on RECIPIENTS_FETCH_REQUESTED actions
function* fetchRecipients(action) {
   try {
      const response = yield call(rest.wrap(mime), '/recipients');
      //const user = yield call(           Api.fetchUser, action.payload.userId);
      yield put({type: "RECIPIENTS_FETCH_SUCCEEDED", recipients: response.entity.recipient });
   } catch (e) {
      yield put({type: "RECIPIENTS_FETCH_FAILED", message: e.message});
   }
}

function* fetchRecipient(action) {
   try {
      if (action.recipientNumber < 0) {
        yield put({type: "RECIPIENT_CLEARED", headers: {}, etag: 0, recipient: {} });
        return;
      }

      const response = yield call(rest.wrap(mime), '/recipients/' + action.recipientNumber);
      //const user = yield call(           Api.fetchUser, action.payload.userId);
      yield put({type: "RECIPIENT_FETCH_SUCCEEDED", headers: response.headers, etag: response.headers.Etag, recipient: response.entity });
      yield put({type: "RECIPIENT_ADDRESS_FETCH_SUCCEEDED", headers: response.headers, etag: response.headers.Etag, postalAddress: response.entity.address });
   } catch (e) {
      yield put({type: "RECIPIENT_FETCH_FAILED", message: e.message});
   }
}

function* postRecipient(action) {
   try {
      if (!action.recipient) {
        console.log('No recip');
        return;
      }

      const client = rest.wrap(mime, { mime: 'application/json' }).wrap(location);
      const address = { address: action.postalAddress }
      const ent = Object.assign({}, action.recipient, address)
      const response = yield call(client, { method: 'POST', path: '/recipients/', entity: ent })
      console.log(response)
      yield put({type: "RECIPIENT_SAVE_SUCCEEDED" });
   } catch (e) {
      yield put({type: "RECIPIENT_SAVE_FAILED", message: e.message});
   }
}
/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
function* mySaga() {
  //yield takeEvery("USER_FETCH_REQUESTED", fetchUser);
  yield takeLatest("RECIPIENTS_FETCH_REQUESTED", fetchRecipients);
  yield takeLatest("LOAD_COUNTRIES", fetchCountries);
  yield takeLatest("LOAD_CURRENCIES", fetchCurrencies);
  yield takeLatest("LOAD_RECIPIENT_REQUESTED", fetchRecipient);
  yield takeLatest("SAVE_RECIPIENT", postRecipient);
//yield takeLatest("RECIPIENT_FETCH_SUCCEEDED", xxx);
}

export default mySaga;
