package de.dashify.backend.auth.security.jwt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import de.dashify.backend.auth.security.services.UserDetailsImpl;
import de.dashify.backend.user.persistance.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class CookieService {
    private static final Logger logger = LoggerFactory.getLogger(CookieService.class);

    @Value("${dashify.app.jwtSecret}")
    private String jwtSecret;

    @Value("${dashify.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    @Value("${dashify.app.jwtCookieName}")
    private String jwtCookie;

    @Value("${dashify.app.userCookieName}")
    private String userCookie;

    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, jwtCookie);
        return (cookie != null) ? cookie.getValue() : null;
    }

    public ResponseCookie generateUserCookie(User user) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper()
                .registerModule(new JavaTimeModule());

        String userJson = objectMapper.writeValueAsString(user);

        String encodedUser = Base64.getEncoder().encodeToString(userJson.getBytes());
        return buildCookieWithDomain(ResponseCookie.from(userCookie, encodedUser)
                .path("/")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .maxAge(24 * 60 * 60)
                .build());
    }

    public ResponseCookie getCleanUserCookie(String path) {
        return buildCookieWithDomain(ResponseCookie.from(userCookie, "")
                .path(path)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .maxAge(0)
                .build());
    }

    public ResponseCookie generateJwtCookie(UserDetailsImpl userPrincipal) {
        String jwt = generateTokenFromUsername(userPrincipal.getUsername());
        return buildCookieWithDomain(ResponseCookie.from(jwtCookie, jwt)
                .path("/")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .maxAge(24 * 60 * 60)
                .build());
    }

    public ResponseCookie getCleanJwtCookie(String path) {
        return buildCookieWithDomain(ResponseCookie.from(jwtCookie, "")
                .path(path)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .maxAge(0)
                .build());
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    public String generateTokenFromUsername(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public ResponseCookie buildCookieWithDomain(ResponseCookie cookie) {
        return activeProfile.toLowerCase().contains("local") ? cookie : cookie.mutate().domain(".dashify.cloud").build();
    }
}
