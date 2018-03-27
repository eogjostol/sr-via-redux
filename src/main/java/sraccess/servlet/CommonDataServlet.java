package sraccess.servlet;

import org.eclipse.jetty.http.HttpStatus;
import sraccess.srclient.HttpClient;
import sraccess.srclient.HttpResponse;
import sraccess.srclient.SrClient;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@SuppressWarnings("serial")
public class CommonDataServlet extends HttpServlet {
    private final SrClient srClient;

    public CommonDataServlet(HttpClient httpClient) {
        this.srClient = new SrClient(httpClient);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getPathInfo();
        HttpResponse httpResponse = getResource(pathInfo);

        if (httpResponse == null) {
            response.setStatus(HttpStatus.NOT_FOUND_404);
            return;
        }

        if (httpResponse.code() != HttpStatus.OK_200) {
            response.setStatus(httpResponse.code());
            return;
        }

        response.setContentType("application/json; charset=utf-8");
        httpResponse.cookiesToBeSet().forEach(o -> response.setHeader("Set-Cookie", o));
        response.setStatus(httpResponse.code());

        try (PrintWriter out = response.getWriter()) {
            out.println(httpResponse.body());
        }
    }

    private HttpResponse getResource(String pathInfo) throws IOException {
        switch (pathInfo) {
            case "/currencies":
                return srClient.getCurrencies();
            case "/constants":
                return srClient.getConstants();
            case "/countries":
                return srClient.getCountries();
            default:
                return null;
        }
    }
}