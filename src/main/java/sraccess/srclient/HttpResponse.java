package sraccess.srclient;

import java.io.IOException;
import java.util.List;

public interface HttpResponse {
    /**
     * Gets the HTTP status code of the response.
     */
    int code();

    /**
     * Gets the body (payload) of the response.
     */
    String body() throws IOException;

    /**
     * Gets the list of cookies to be set in the next request.
     */
    List<String> cookiesToBeSet();

    /**
     * Gets the URI of the resource created in a POST request.
     */
    String location();
}
