package sraccess.srclient;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

/**
 * Fake HTTP client to be used in tests.
 */
public class FakeHttpClient implements HttpClient {

    @Override
    public HttpResponse getResource(String url, SrAuthentication authentication) {

        return new HttpResponse() {
            @Override
            public int code() {
                return HttpServletResponse.SC_OK;
            }

            @Override
            public String body() {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                if (url.endsWith("countries")) {
                    return "[\n" +
                            "    \"NORGE\",\n" +
                            "    \"AFGHANISTAN\",\n" +
                            "    \"ALBANIA\",\n" +
                            "    \"ZAMBIA\",\n" +
                            "    \"ZIMBABWE\",\n" +
                            "    \"ÅLAND\"\n" +
                            "]";
                } else if (url.endsWith("exchangeRates")) {
                    return "[{\n" +
                            "    \"code\": \"JPY\",\n" +
                            "    \"name\": \"Japanske yen\",\n" +
                            "    \"rate\": 0.0581\n" +
                            "}, {\n" +
                            "    \"code\": \"CNY\",\n" +
                            "    \"name\": \"Kinesiske yuan\",\n" +
                            "    \"rate\": 1.1035\n" +
                            "}, {\n" +
                            "    \"code\": \"CZK\",\n" +
                            "    \"name\": \"Tsjekkiske koruna\",\n" +
                            "    \"rate\": 0.3048\n" +
                            "}, {\n" +
                            "    \"code\": \"NOK\",\n" +
                            "    \"name\": \"Norske kroner\",\n" +
                            "    \"rate\": 1\n" +
                            "}]";
                } else if (url.endsWith("recipients/1")) {
                    return "{ \"number\": 1, \"name\": \"rec1\", \"mobile\": \"40000001\", \"organizationNumber\": \"12340001\", \"email\": \"rec1@mail.com\"," +
                            "\"address\": { \"line1\": \"l1\", \"line2\": \"l2\", \"postCode\": \"9991\", \"city\": \"Onetown\", \"country\": \"ZAMBIA\"}}";
                } else if (url.endsWith("recipients/2")) {
                    return "{ \"number\": 2, \"name\": \"rec2\", \"mobile\": \"40000002\", \"organizationNumber\": \"12340002\", \"email\": \"rec2@mail.com\"," +
                            "\"address\": { \"line1\": \"l12\", \"line2\": \"l22\", \"postCode\": \"9992\", \"city\": \"Twotown\", \"country\": \"NORGE\"}}";
                } else if (url.contains("/recipients/all")) {
                    return "{ \"recipient\": [{\"number\": 1, \"name\": \"rec1\"}, {\"number\": 2, \"name\": \"rec2\" }] }";
                }

                return "";
            }

            @Override
            public List<String> cookiesToBeSet() {
                ArrayList<String> list = new ArrayList<>();
                list.add("TestCookie=Xyz; path=/");
                return list;
            }

            @Override
            public String location() {
                return null; // not relevant for GET requests
            }
        };
    }

    @Override
    public HttpResponse createResource(String url, String entity, SrAuthentication authentication) {
        return new HttpResponse() {
            @Override
            public int code() {
                return HttpServletResponse.SC_CREATED;
            }

            @Override
            public String body() {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                return "";
            }

            @Override
            public List<String> cookiesToBeSet() {
                ArrayList<String> list = new ArrayList<>();
                list.add("TestCookie=Xyz; path=/");
                return list;
            }

            @Override
            public String location() {
                return "http://localhost:8080/recipients/9";
            }
        };
    }
}
