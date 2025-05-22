package com.drone.droneApp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

import com.drone.droneApp.security.JwtRequestFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;
    private final CorsFilter corsFilter;

    public SecurityConfig(JwtRequestFilter jwtRequestFilter, CorsFilter corsFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
        this.corsFilter = corsFilter;
    }    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
            .csrf((csrf) -> csrf.disable())
            .authorizeHttpRequests((auth) -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }    // Password encoder is now in PasswordConfig
}