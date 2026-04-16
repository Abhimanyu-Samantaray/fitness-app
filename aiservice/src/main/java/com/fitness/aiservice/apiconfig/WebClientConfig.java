package com.fitness.aiservice.apiconfig;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean(name = "loadBalancedWebClient")
    @LoadBalanced
    public WebClient.Builder loadBalancedWebClient() {
        return WebClient.builder();
    }

    @Bean(name = "externalWebClient")
    public WebClient.Builder externalWebClient() {
        return WebClient.builder();
    }

}
