package de.dashify.backend.auth.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Throwable rootCause = (Throwable) request.getAttribute("jakarta.servlet.error.exception");

        int status;
        String error;
        String message;

        if (rootCause != null) {
            status = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
            error = "Internal Server Error";
            message = rootCause.getMessage() != null ? rootCause.getMessage() : "Unexpected error occurred";
        } else {
            status = HttpServletResponse.SC_UNAUTHORIZED;
            error = "Unauthorized";
            message = authException.getMessage();
        }

        response.setStatus(status);

        final Map<String, Object> body = new HashMap<>();
        body.put("status", status);
        body.put("error", error);
        body.put("message", message);
        body.put("path", request.getServletPath());

        final ObjectMapper mapper = new ObjectMapper()
                .registerModule(new JavaTimeModule());
        mapper.writeValue(response.getOutputStream(), body);
    }


}
