package sraccess.servlet;

import sraccess.srclient.HttpClient;
import sraccess.srclient.HttpResponse;
import sraccess.srclient.SrAuthentication;
import sraccess.srclient.SrClient;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Base64;

@SuppressWarnings("serial")
public class LoginServlet extends HttpServlet {
    private final SrClient srClient;

    public LoginServlet(HttpClient httpClient) {
        this.srClient = new SrClient(httpClient);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String queryString = request.getQueryString();
        String username = getUsername(queryString);
        String password = getPassword(queryString);
        String originatorId = "???";

        if (username == null || password == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        String toEncode = String.format("%s:%s", username, password);
        String basicAuth = Base64.getEncoder().encodeToString(toEncode.getBytes());
        SrAuthentication authentication = new SrAuthentication(basicAuth, originatorId);
        HttpResponse loginResponse = srClient.logIn(authentication);
        response.setContentType("application/json; charset=utf-8");
        response.setStatus(loginResponse.code());
        loginResponse.cookiesToBeSet().forEach(o -> response.setHeader("Set-Cookie", o));

        try (PrintWriter out = response.getWriter()) {
            out.println(loginResponse.body());
        }
    }

    private String getPassword(String queryString) {
        return getQueryStringPart(queryString, 0);
    }

    private String getUsername(String queryString) {
        return getQueryStringPart(queryString, 1);
    }

    private String getQueryStringPart(String queryString, int index) {
        if (queryString == null) {
            return null;
        }
        String[] parts = queryString.split("&");

        if (index >= parts.length) {
            return null;
        }

        String[] subParts = parts[index].split("=");

        if (subParts.length < 2) {
            return null;
        }

        return subParts[1];
    }
}