package sraccess.srclient;

import java.io.IOException;

public interface HttpClient {
    HttpResponse getResource(String url, SrAuthentication authentication) throws IOException;

    HttpResponse createResource(String url, String entity, SrAuthentication authentication) throws IOException;
}
