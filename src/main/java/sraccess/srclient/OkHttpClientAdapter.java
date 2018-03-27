package sraccess.srclient;

import okhttp3.*;

import java.io.IOException;
import java.util.List;

/**
 * Adapts <em>OkHttp</em> (3rd party HTTP client) to the local {@code HttpClient} interface.
 * <p>
 * For info about OkHttp, see <a href="http://square.github.io/okhttp/">its homepage</a>.
 */
public class OkHttpClientAdapter implements HttpClient {

    private final OkHttpClient client;

    public OkHttpClientAdapter(OkHttpClient client) {
        this.client = client;
    }

    @Override
    public HttpResponse getResource(String url, SrAuthentication authentication) throws IOException {
        Request request = buildRequest(url, authentication);
        Response response = client.newCall(request).execute();

        return new HttpResponse() {
            @Override
            public int code() {
                return response.code();
            }

            @Override
            public String body() throws IOException {
                ResponseBody body = response.body();
                return body == null ? null : body.string();
            }

            @Override
            public List<String> cookiesToBeSet() {
                return response.headers("Set-Cookie");
            }

            @Override
            public String location() {
                return null;
            }
        };
    }

    @Override
    public HttpResponse createResource(String url, String entity, SrAuthentication authentication) throws IOException {
        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), entity);
        Request request = buildPostRequest(url, requestBody, authentication);
        Response response = client.newCall(request).execute();

        return new HttpResponse() {
            @Override
            public int code() {
                return response.code();
            }

            @Override
            public String body() throws IOException {
                ResponseBody body = response.body();
                return body == null ? null : body.string();
            }

            @Override
            public List<String> cookiesToBeSet() {
                return response.headers("Set-Cookie");
            }

            @Override
            public String location() {
                return response.header("Location");
            }
        };
    }

    private Request buildRequest(String url, SrAuthentication authentication) {

        return new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Basic " + authentication.getBase64BasicCredentials())
                .addHeader("Originator-Id", authentication.getOriginatorId())
                .addHeader("Accept", "application/json")
                .addHeader("Content-Type", "application/json")
                .build();
    }

    private Request buildPostRequest(String url, RequestBody body, SrAuthentication authentication) {

        return new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Basic " + authentication.getBase64BasicCredentials())
                .addHeader("Originator-Id", authentication.getOriginatorId())
                .addHeader("Accept", "application/json")
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();
    }
}
