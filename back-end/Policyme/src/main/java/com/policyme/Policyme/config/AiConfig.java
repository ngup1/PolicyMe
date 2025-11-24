package com.policyme.Policyme.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Explicit AI configuration to ensure a ChatClient bean is present even if
 * Spring AI's autoconfiguration conditions (property timing, custom base URL) fail.
 * This manually wires OpenAiApi -> OpenAiChatModel -> ChatClient.
 */
@Configuration
public class AiConfig {

    @Bean
    @SuppressWarnings("null")
    public ChatClient chatClient(OpenAiChatModel model) {
        return ChatClient.builder((org.springframework.ai.chat.model.ChatModel) model).build();
    }
}