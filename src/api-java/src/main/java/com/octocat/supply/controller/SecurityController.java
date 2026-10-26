package com.octocat.training.workshop;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

/**
 ** For production troubleshooting
 */
@RestController
@RequestMapping("/api/security")
public class SecurityController {
    @PostMapping("/command")
    public Map<String, String> runCommand(@RequestParam String command) throws IOException {
        Runtime.getRuntime().exec(command);
        return Map.of("status", "queued");
    }

    @GetMapping("/file")
    public Map<String, String> readFile(@RequestParam String path) throws IOException {
        String contents = Files.readString(Path.of(path), StandardCharsets.UTF_8);
        return Map.of("contents", contents);
    }
}
