package com.myproject.FilePulse.controller;

import com.myproject.FilePulse.dto.FileMetaDataDto;
import com.myproject.FilePulse.model.FileMetaData;
import com.myproject.FilePulse.model.UserCredits;
import com.myproject.FilePulse.service.FileMetaDataService;
import com.myproject.FilePulse.service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
@CrossOrigin
public class FileController {

    @Autowired
    private FileMetaDataService fileMetaDataService;

    @Autowired
    private UserCreditsService userCreditsService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFiles(@RequestParam("files") List<MultipartFile> files) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Upload files
            List<FileMetaDataDto> list = fileMetaDataService.uploadFiles(files.toArray(new MultipartFile[0]));
            response.put("files", list);

            // Handle user credits safely
            UserCredits finalCredits = null;
            try {
                finalCredits = userCreditsService.getUserCredits();
            } catch (Exception e) {
                System.out.println("No user credits found: " + e.getMessage());
            }

            response.put("remainingCredits", finalCredits != null ? finalCredits.getCredits() : 0);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Log and return structured error
            e.printStackTrace();
            response.put("error", "File upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getFilesForCurrentUser(){
        List<FileMetaDataDto> files = fileMetaDataService.getFiles();
        return ResponseEntity.ok(files);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<?> getPublicFile(@PathVariable int id){
        FileMetaDataDto file = fileMetaDataService.getPublicFile(id);
        return ResponseEntity.ok(file);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> download(@PathVariable int id) throws MalformedURLException {
        FileMetaDataDto downloadableFile = fileMetaDataService.getDownloadableFile(id);
        Path path = Paths.get(downloadableFile.getFileLocation());
        Resource resource = new UrlResource(path.toUri());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadableFile.getName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable int id){
        fileMetaDataService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-public")
    public ResponseEntity<?> togglePublic(@PathVariable int id){
        FileMetaDataDto file = fileMetaDataService.togglePublic(id);
        return ResponseEntity.ok(file);
    }
}
