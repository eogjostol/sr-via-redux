package sraccess.srclient;

import org.eclipse.jetty.http.HttpStatus;

import java.io.IOException;

public class SrClient {

    private static final String URL = "https://www.sendregning.no";
    private static final String COMMON_DATA_URL = URL + "/common";
    private static final String RECIPIENTS_URL = URL + "/recipients";
    private final HttpClient httpClient;
    private SrAuthentication authentication;

    public SrClient(HttpClient httpClient) {
        this.httpClient = httpClient;
    }

    public HttpResponse logIn(SrAuthentication authentication) throws IOException {
        HttpResponse response = httpClient.getResource(URL + "/user/login", authentication);
        this.authentication = response.code() == HttpStatus.OK_200 ? authentication : null;
        return response;
    }

    public HttpResponse getConstants() throws IOException {
        return httpClient.getResource(COMMON_DATA_URL + "/constants", authentication);
    }

    public HttpResponse getCurrencies() throws IOException {
        return httpClient.getResource(COMMON_DATA_URL + "/currency/exchangeRates", authentication);
    }

    public HttpResponse getCountries() throws IOException {
        return httpClient.getResource(COMMON_DATA_URL + "/countries", authentication);
    }

    public HttpResponse getRecipient(String pathInfo) throws IOException {
        return httpClient.getResource(RECIPIENTS_URL + pathInfo, authentication);
    }

    public HttpResponse getRecipients() throws IOException {
        return httpClient.getResource(RECIPIENTS_URL + "/all?limit=10&offset=0", authentication);
    }

    public HttpResponse createRecipient(String json) throws IOException {
        return httpClient.createResource(RECIPIENTS_URL, json, authentication);
    }
}
