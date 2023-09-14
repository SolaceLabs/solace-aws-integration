package com.solace.quoteengine.processor.globaleodeventprocessor.processor;

import com.solace.quoteengine.processor.globaleodeventprocessor.model.EODEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.function.Consumer;

@Slf4j
@Service
public class GlobalEodEventProcessor {


    @Bean
    public Consumer<String> globalEodEventConsumer() {
        return data -> {
            log.info(data);
        };
    }
}
