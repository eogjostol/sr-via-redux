package sraccess.srclient;

public class SrAuthentication {

    private final String base64BasicCredentials;
    private final String originatorId;

    /**
     * Constructs an instance of {@code SrAuthentication}.
     * @param base64BasicCredentials the base64-encoded basic auth. credentials
     * @param originatorId the SR originator ID
     */
    public SrAuthentication(String base64BasicCredentials, String originatorId) {
        this.base64BasicCredentials = base64BasicCredentials;
        this.originatorId = originatorId;
    }

    public String getBase64BasicCredentials() {
        return base64BasicCredentials;
    }

    public String getOriginatorId() {
        return originatorId;
    }
}
