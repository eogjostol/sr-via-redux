package sraccess.servlet;

import sraccess.srclient.HttpClient;
import sraccess.srclient.HttpResponse;
import sraccess.srclient.SrClient;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.stream.Collectors;

@SuppressWarnings("serial")
public class RecipientServlet extends HttpServlet {
    private final SrClient srClient;

    public RecipientServlet(HttpClient httpClient) {
        this.srClient = new SrClient(httpClient);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getPathInfo();
        HttpResponse httpResponse = isRequestForSingleRecipient(pathInfo) ? srClient.getRecipient(pathInfo) : srClient.getRecipients();
        response.setContentType("application/json; charset=utf-8");
        response.setStatus(httpResponse.code());

        try (PrintWriter out = response.getWriter()) {
            out.println(httpResponse.body());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String json = request.getReader().lines().collect(Collectors.joining("\n"));
        HttpResponse httpResponse = srClient.createRecipient(json);
        response.setHeader("Location", httpResponse.location());
    }

    private static boolean isRequestForSingleRecipient(String pathInfo) {
        return pathInfo != null && pathInfo.length() == 2;
    }
}