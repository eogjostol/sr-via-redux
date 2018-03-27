package sraccess;

import okhttp3.OkHttpClient;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.util.resource.Resource;
import sraccess.servlet.CommonDataServlet;
import sraccess.servlet.LoginServlet;
import sraccess.servlet.RecipientServlet;
import sraccess.srclient.FakeHttpClient;
import sraccess.srclient.HttpClient;
import sraccess.srclient.OkHttpClientAdapter;

import javax.servlet.Servlet;
import java.io.File;
import java.net.URI;

public class SrAccessServer {
    private static final boolean IS_PRODUCTION_SERVER = false;
    private static final int PORT = 8080;
    private static final String WEB_ROOT_PATH = "dist";
    private static final String WELCOME_FILE = "./index.html"; // Used when client requests a directory
    private static HttpClient httpClient;

    public static void main(String[] args) throws Exception {
        Server server = new Server(PORT);
        URI webrootUri = new File(WEB_ROOT_PATH).toPath().toRealPath().toUri();
        Resource webroot = Resource.newResource(webrootUri);

        if (!webroot.exists()) {
            System.err.println("Resource does not exist: " + webroot);
            System.exit(-1);
        }

        if (!webroot.isDirectory()) {
            System.err.println("Resource is not a directory: " + webroot);
            System.exit(-1);
        }

        httpClient = IS_PRODUCTION_SERVER ? new OkHttpClientAdapter(new OkHttpClient()) : new FakeHttpClient();
        ServletContextHandler context = prepareServletContextHandler(webroot);
        server.setHandler(context);
        context.addServlet(prepareLoginServlet(), "/login");
        context.addServlet(prepareRecipientServlet(), "/recipients/*");
        context.addServlet(prepareCommonDataServlet(), "/common/*");

        // Add default servlet (always last); must be named "default", must be on path mapping "/"
        context.addServlet(prepareDefaultServlet(), "/");
        server.start();
        server.join();
    }

    private static ServletHolder prepareLoginServlet() {
        Servlet servlet = new LoginServlet(httpClient);
        return prepareServletHolder(servlet, 0);
    }

    private static ServletHolder prepareCommonDataServlet() {
        Servlet servlet = new CommonDataServlet(httpClient);
        return prepareServletHolder(servlet, 1);
    }

    private static ServletHolder prepareRecipientServlet() {
        Servlet servlet = new RecipientServlet(httpClient);
        return prepareServletHolder(servlet, 2);
    }

    private static ServletHolder prepareDefaultServlet() {
        ServletHolder holder = new ServletHolder("default", DefaultServlet.class);
        holder.setInitParameter("dirAllowed", "true");
        return holder;
    }

    private static ServletContextHandler prepareServletContextHandler(Resource webroot) {
        ServletContextHandler handler = new ServletContextHandler(ServletContextHandler.SESSIONS);
        handler.setContextPath("/");
        handler.setBaseResource(webroot);
        handler.setWelcomeFiles(new String[]{WELCOME_FILE});
        return handler;
    }

    private static ServletHolder prepareServletHolder(Servlet servlet, int initOrder) {
        ServletHolder holder = new ServletHolder(servlet);
        holder.setInitOrder(initOrder);
        return holder;
    }
}
