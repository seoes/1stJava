package movieweb.webapp.service;

import org.springframework.beans.factory.annotation.Value;

public class test {
    @Value("${java.file.test}")
    String envValue;

}
